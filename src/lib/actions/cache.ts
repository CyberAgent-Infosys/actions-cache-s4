import * as path from 'path';
import * as fs from 'fs';
import fetch from 'node-fetch';
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
import { NO_MESSAGE_RECEIVED, createMeta, createChunk } from '@/lib/proto';
import { isSuccessStatusCode } from '@/lib/actions/requestUtils';
import { GatewayClient } from '@/gen/proto/actions_cache_gateway_grpc_pb.js';
import { UploadCacheRequest, RestoreCacheRequest, RestoreCacheResponse } from '@/gen/proto/actions_cache_gateway_pb.js';
import { GatewayClientConfig } from '@/@types/input';

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

export class ReserveCacheError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ReserveCacheError';
    Object.setPrototypeOf(this, ReserveCacheError.prototype);
  }
}

export class ApiRequestError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ApiRequestError';
    Object.setPrototypeOf(this, ApiRequestError.prototype);
  }
}

export class FileStreamError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'FileStreamError';
    Object.setPrototypeOf(this, FileStreamError.prototype);
  }
}

export class ArchiveFileError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ArchiveFileError';
    Object.setPrototypeOf(this, ArchiveFileError.prototype);
  }
}

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

    // API用のStream
    const apiRequestStream = client.uploadCache(err => {
      // APIからレスポンスがあった際に呼ばれる
      // NO_MESSAGE_RECEIVEDはスルー
      if (err && err?.code !== NO_MESSAGE_RECEIVED) {
        return reject(new ApiRequestError('APIエラー'));
      }

      logDebug('finished API request.');
      client.close();
      resolve();
    });

    // リクエストストリームに書き込む
    // Upload Request
    const request = new UploadCacheRequest();
    const meta = createMeta(config);
    request.setMeta(meta);
    apiRequestStream.write(request);

    let chunkNum = 0;
    const readFileStream = fs.createReadStream(archivePath, { highWaterMark: uploadChunkSize });
    readFileStream
      .on('data', data => {
        // 100kB読み出す毎に呼ばれる
        const uploadRequest = new UploadCacheRequest();
        const chunk = createChunk(data, chunkNum);
        uploadRequest.setChunk(chunk);
        apiRequestStream.write(uploadRequest);
        chunkNum++;
      })
      .on('error', () => {
        return reject(new FileStreamError('failed to read file.'));
      });

    readFileStream.on('end', async () => {
      logDebug('fileStream読込完了');
      apiRequestStream.end();

      // Try to delete the archive to save space
      try {
        await unlinkFile(archivePath);
      } catch (error) {
        logDebug(`Failed to delete archive: ${error}`);
      }

      // APIに終了を伝える
      apiRequestStream.end();
    });

    readFileStream.on('error', e => {
      logDebug(`Failed to read archive: ${e}`);
    });
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

    // APIからレスポンスがあった際に呼ばれる
    const response = await new Promise<RestoreCacheResponse | undefined>((_resolve, _reject) =>
      client.restoreCache(restoreCacheRequest, (err, res) => {
        if (err) _reject(new ApiRequestError('APIエラー'));
        _resolve(res);
      }),
    );

    const presignUrl = response?.getPreSignedUrl() ?? '';
    if (!presignUrl) reject(new ApiRequestError('データ取得エラー'));
    // logDebug(`presignUrl: ${presignUrl}`);

    // TODO: setSecretってなんだろう
    setSecret(presignUrl);

    const responseData = await fetch(presignUrl);

    if (responseData.status === 204 || !isSuccessStatusCode(responseData.status)) {
      return reject(new ApiRequestError('No Contents.'));
    }

    const archivePath = path.join(await createTempDirectory(), getCacheFileName(compressionMethod));
    logDebug(`Archive Path: ${archivePath}`);

    try {
      await downloadCacheHttpClient(presignUrl, archivePath);

      if (isAnnoy) await listTar(archivePath, compressionMethod);
      const archiveFileSize = getArchiveFileSizeInBytes(archivePath);
      logInfo(`Cache Size: ~${Math.round(archiveFileSize / (1024 * 1024))} MB (${archiveFileSize} B)`);

      await extractTar(archivePath, compressionMethod);
      logInfo('Cache restored successfully');

      // TODO: cacheKeyの代わりになる？
      const etag = responseData.headers?.get('etag') ?? undefined;
      resolve(etag);
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
