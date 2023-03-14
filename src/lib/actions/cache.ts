import * as path from 'path';
import * as fs from 'fs';
import { fetchRetry as fetch } from '@/lib/fetch';
import { isAnnoy } from '@/lib/utils';
import { logDebug, logInfo, setSecret } from '@/lib/actions/core';
import {
  getCompressionMethod,
  resolvePaths,
  getCacheFileName,
  getArchiveFileSizeInBytes,
  createTempDirectory,
  isGhes,
  unlinkFile,
} from '@/lib/actions/cacheUtils';
import { listTar, createTar, extractTar } from '@/lib/actions/tar';
import { downloadCacheHttpClient } from '@/lib/actions/downloadUtils';
import { createMeta } from '@/lib/proto';
import { isSuccessStatusCode, isServerErrorStatusCode } from '@/lib/actions/requestUtils';
import { ValidationError, ApiRequestError, FileStreamError, ArchiveFileError } from '@/lib/actions/error';
import { GatewayClient } from '@/gen/proto/actions_cache_gateway_grpc_pb.js';
import { UploadCacheRequest, RestoreCacheRequest, RestoreCacheResponse } from '@/gen/proto/actions_cache_gateway_pb.js';
import { GatewayClientConfig } from '@/@types/input';
import { Headers } from 'node-fetch';

function checkPaths(paths: string[]): void {
  if (!paths || paths.length === 0) {
    throw new ValidationError('Path Validation Error: At least one directory or file path is required');
  }
}

function checkKey(key: string): void {
  if (key.length > 512) {
    throw new ValidationError(`Key Validation Error: ${key} cannot be larger than 512 characters.`);
  }
  const regex = /^[^,]*$/;
  if (!regex.test(key)) {
    throw new ValidationError(`Key Validation Error: ${key} cannot contain commas.`);
  }
}

export async function saveCache(client: GatewayClient, config: GatewayClientConfig): Promise<void> {
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
    const fileSizeLimit = 10 * 1024 * 1024 * 1024; // 10GB per repo limit
    const archiveFileSize = getArchiveFileSizeInBytes(archivePath);
    logDebug(`File Size: ${archiveFileSize}`);

    // For GHES, this check will take place in ReserveCache API with enterprise file size limit
    if (archiveFileSize > fileSizeLimit && !isGhes()) {
      reject(
        new ArchiveFileError(
          `Cache size of ~${Math.round(
            archiveFileSize / (1024 * 1024),
          )} MB (${archiveFileSize} B) is over the 10GB limit, not saving cache.`,
        ),
      );
    }

    // Upload Request
    const request = new UploadCacheRequest();
    const meta = createMeta(config);
    request.setMeta(meta);

    // upload Cache API
    const presignedUrl = await new Promise<string | undefined>((_resolve, _reject) =>
      client.uploadCache(request, (err, res) => {
        if (err) _reject(new ApiRequestError('APIエラー'));
        const url = res?.getPreSignedUrl();
        if (!url) reject(new ApiRequestError('presignedUrl not found.'));
        _resolve(url);
      }),
    );
    if (!presignedUrl) return reject(new ApiRequestError('undefined presignedUrl.'));

    const readFileStream = fs.createReadStream(archivePath, { highWaterMark: uploadChunkSize });
    const uploadResponse = await fetch(presignedUrl, {
      method: 'PUT',
      headers: new Headers({ 'Content-Length': `${archiveFileSize}` }),
      body: readFileStream,
    });
    if (!isSuccessStatusCode(uploadResponse.status) || isServerErrorStatusCode(uploadResponse.status)) {
      reject(new ApiRequestError('Upload failed.'));
    }

    return resolve();
  });
}

export async function restoreCache(client: GatewayClient, config: GatewayClientConfig): Promise<string | undefined> {
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
    for (const k of keys) {
      checkKey(k);
    }

    const compressionMethod = await getCompressionMethod();

    // path are needed to compute version
    const restoreCacheRequest = new RestoreCacheRequest();
    const meta = createMeta(config);
    restoreCacheRequest.setMeta(meta);
    restoreCacheRequest.setRestoreKeysList(keys);

    // fetch Restore Cache API
    const response = await new Promise<RestoreCacheResponse | undefined>((_resolve, _reject) =>
      client.restoreCache(restoreCacheRequest, (err, res) => {
        if (err) _reject(new ApiRequestError('APIエラー'));
        _resolve(res);
      }),
    );

    const preSignedUrl = response?.getPreSignedUrl() ?? '';
    const cacheKey = response?.getCacheKey() ?? '';
    if (!preSignedUrl) reject(new ApiRequestError('データ取得エラー'));
    setSecret(preSignedUrl);

    const cacheData = await fetch(preSignedUrl);
    if (
      cacheData.status === 204 ||
      !isSuccessStatusCode(cacheData.status) ||
      isServerErrorStatusCode(cacheData.status)
    ) {
      return reject(new ApiRequestError('No Contents.'));
    }

    const archivePath = path.join(await createTempDirectory(), getCacheFileName(compressionMethod));
    logDebug(`Archive Path: ${archivePath}`);

    try {
      await downloadCacheHttpClient(preSignedUrl, archivePath);

      if (isAnnoy) await listTar(archivePath, compressionMethod);
      const archiveFileSize = getArchiveFileSizeInBytes(archivePath);
      logInfo(`Cache Size: ~${Math.round(archiveFileSize / (1024 * 1024))} MB (${archiveFileSize} B)`);

      await extractTar(archivePath, compressionMethod);
      logInfo('Cache restored successfully');

      resolve(cacheKey);
    } finally {
      // Try to delete the archive to save space
      try {
        await unlinkFile(archivePath);
      } catch (error) {
        reject(new FileStreamError(`Failed to delete archive: ${error}`));
      }
    }

    resolve('');
  });
}
