import * as fs from 'fs';
import * as path from 'path';
import { Response } from 'node-fetch';
import pLimit from 'p-limit';
import { GatewayClientConfig } from '@/@types/proto';
import { GatewayClient } from '@/gen/proto/actions_cache_gateway_grpc_pb.js';
import { UploadedParts } from '@/gen/proto/actions_cache_gateway_pb.js';
import {
  getCompressionMethod,
  resolvePaths,
  getCacheFileName,
  getArchiveFileSizeInBytes,
  createTempDirectory,
  isGhes,
  unlinkFile,
  checkPaths,
  checkKey,
} from '@/lib/actions/cacheUtils';
import { ConcurrentUploads, FileSizeLimit } from '@/lib/actions/constants';
import { logDebug, logInfo, setSecret } from '@/lib/actions/core';
import { downloadCacheHttpClient } from '@/lib/actions/downloadUtils';
import { ValidationError, ApiRequestError, FileStreamError, ArchiveFileError } from '@/lib/actions/error';
import { isErrorStatusCode } from '@/lib/actions/requestUtils';
import { listTar, createTar, extractTar } from '@/lib/actions/tar';
import { fetchRetry as fetch } from '@/lib/fetch';
import {
  startMultipartUploadCacheRequest,
  completeMultipartUploadCacheRequest,
  createRestoreCacheRequest,
  createUploadedParts,
  abortMultipartUploadCacheRequest,
  restoreCache,
  startMultipartUploadCache,
  abortMultipartUploadCache,
  completeMultipartUploadCache,
  uploadProc,
} from '@/lib/proto';
import { isAnnoy } from '@/lib/utils';

export async function execSaveCache(client: GatewayClient, config: GatewayClientConfig): Promise<void> {
  return new Promise(async (resolve, reject) => {
    const { paths, key, uploadChunkSize } = config;

    // 問題があればthrow
    checkPaths(paths);
    checkKey(key);

    const compressionMethod = await getCompressionMethod();
    const cachePaths = await resolvePaths(paths);
    logDebug('Cache Paths:');
    logDebug(`${JSON.stringify(cachePaths)}`);

    const archiveFolder = await createTempDirectory();
    const archivePath = path.join(archiveFolder, getCacheFileName(compressionMethod));
    logDebug(`Archive Path: ${archivePath}`);

    await createTar(archiveFolder, cachePaths, compressionMethod);
    if (isAnnoy) await listTar(archivePath, compressionMethod);
    const archiveFileSize = getArchiveFileSizeInBytes(archivePath);
    const totalPart = Math.ceil(archiveFileSize / uploadChunkSize);
    logDebug(`File Size: ${archiveFileSize}`);
    logDebug(`Total Part: ${totalPart}`);

    // For GHES, this check will take place in ReserveCache API with enterprise file size limit
    if (archiveFileSize > FileSizeLimit && !isGhes()) {
      return reject(
        new ArchiveFileError(
          `Cache size of ~${Math.round(
            archiveFileSize / (1024 * 1024),
          )} MB (${archiveFileSize} B) is over the 10GB limit, not saving cache.`,
        ),
      );
    }

    // Upload Request
    const uploadRequest = startMultipartUploadCacheRequest(config, totalPart);
    const multipartUploadResponse = await startMultipartUploadCache(client, uploadRequest);
    if (!multipartUploadResponse) return reject(new ApiRequestError('Failed multipartUpload Request.'));

    const uploadId = multipartUploadResponse.uploadId;
    const uploadKey = multipartUploadResponse.uploadKey;
    const presignedUrls: string[] = multipartUploadResponse.preSignedUrlsList;

    let i = 0;
    const uploadPromises: Promise<Response>[] = [];
    const readFileStream = fs.createReadStream(archivePath, { highWaterMark: uploadChunkSize });
    readFileStream
      .on('data', data => {
        // chunkSize読み出す毎に呼ばれる
        const start = i * uploadChunkSize;
        const end = Math.min(start + uploadChunkSize, archiveFileSize) - 1;
        const partSize = end - start + 1;

        uploadPromises.push(
          fetch(presignedUrls[i], {
            method: 'PUT',
            headers: { 'Content-Length': `${partSize}` },
            body: data,
          }),
        );

        i++;
      })
      .on('error', () => {
        return reject(new FileStreamError('failed to read file.'));
      });

    readFileStream.on('end', async () => {
      logDebug('File load completed.');
      logDebug(`Concurrenct uploads: ${ConcurrentUploads}`);

      const plimit = pLimit(ConcurrentUploads);
      const uploadedPartPromises = uploadPromises.map(async req => plimit(async () => uploadProc(req)));

      let etags;
      try {
        const uploadedInfos = await Promise.all(uploadedPartPromises);
        etags = uploadedInfos.filter((v): v is UploadedParts.AsObject => v !== null);
        if (!etags) throw new Error('No ETags.');
      } catch (error) {
        if (error instanceof Error) {
          // Abort Request
          const abortRequest = abortMultipartUploadCacheRequest(config, uploadId, uploadKey);
          await abortMultipartUploadCache(client, abortRequest);
        }
        // abort後rejectをなげる
        return reject(error);
      }

      // Complete Request
      const partsList = createUploadedParts(etags);
      const completeUploadRequest = completeMultipartUploadCacheRequest(config, uploadId, uploadKey, partsList);
      await completeMultipartUploadCache(client, completeUploadRequest);

      // Try to delete the archive to save space
      try {
        logDebug('Removed archive file.');
        await unlinkFile(archivePath);
      } catch (error) {
        logDebug(`Failed to delete archive: ${error} `);
      }

      return resolve();
    });
  });
}

export async function execRestoreCache(client: GatewayClient, config: GatewayClientConfig): Promise<string | void> {
  return new Promise(async (resolve, reject) => {
    const { paths, key, restoreKeys } = config;

    // 問題があればthrow
    checkPaths(paths);

    const keys = [key, ...(restoreKeys ?? [])];

    logDebug('Resolved Keys:');
    logDebug(JSON.stringify(keys));

    if (keys.length > 10) {
      reject(new ValidationError('Key Validation Error: Keys are limited to a maximum of 10.'));
    }
    for (const k of keys) checkKey(k);

    const compressionMethod = await getCompressionMethod();

    // fetch Restore Cache API
    const restoreCacheRequest = createRestoreCacheRequest(config, keys);
    const response = await restoreCache(client, restoreCacheRequest);
    if (!response) return resolve();

    const presignedUrl = response?.preSignedUrl;
    const cacheKey = response?.cacheKey;

    if (!presignedUrl || !cacheKey) return reject(new ApiRequestError('データ取得エラー'));
    if (presignedUrl) setSecret(presignedUrl);

    const cacheData = await fetch(presignedUrl);
    if (cacheData.status === 204 || isErrorStatusCode(cacheData.status)) {
      return reject(new ApiRequestError('No Contents.'));
    }

    const archivePath = path.join(await createTempDirectory(), getCacheFileName(compressionMethod));
    logDebug(`Archive Path: ${archivePath} `);

    try {
      await downloadCacheHttpClient(presignedUrl, archivePath);

      if (isAnnoy) await listTar(archivePath, compressionMethod);
      const archiveFileSize = getArchiveFileSizeInBytes(archivePath);
      logInfo(`Cache Size: ~${Math.round(archiveFileSize / (1024 * 1024))} MB(${archiveFileSize} B)`);

      await extractTar(archivePath, compressionMethod);
      logInfo('Cache restored successfully');

      return resolve(cacheKey);
    } finally {
      // Try to delete the archive to save space
      try {
        await unlinkFile(archivePath);
      } catch (error) {
        reject(new FileStreamError(`Failed to delete archive: ${error} `));
      }
    }
  });
}
