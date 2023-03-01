import * as path from 'path';
import * as fs from 'fs';
import { S3ClientConfig } from '@aws-sdk/client-s3';
import { isDebug, isSilent } from '@/lib/utils';
import { logDebug, logInfo } from '@/lib/actions/core';
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
import { downloadS3Cache, getCacheEntry } from '@/lib/actions/cacheHttpClient';
import { CHUNK_SIZE, NO_MESSAGE_RECEIVED, createMeta, createChunk } from '@/lib/proto';
import { GatewayClientConfig } from '@/@types/input';
import { GatewayClient } from '@/gen/proto/actions_cache_gateway_grpc_pb.js';
import { UploadCacheRequest } from '@/gen/proto/actions_cache_gateway_pb.js';

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
    const { paths, key } = config;

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
    if (isDebug && !isSilent) {
      await listTar(archivePath, compressionMethod);
    }
    const fileSizeLimit = 10 * 1024 * 1024 * 1024; // 10GB per repo limit
    const archiveFileSize = getArchiveFileSizeInBytes(archivePath);
    logDebug(`File Size: ${archiveFileSize}`);

    // For GHES, this check will take place in ReserveCache API with enterprise file size limit
    if (archiveFileSize > fileSizeLimit && !isGhes()) {
      reject(
        new Error(
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

      logDebug('API完了');
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
    const readFileStream = fs.createReadStream(archivePath, { highWaterMark: CHUNK_SIZE });
    readFileStream
      .on('data', data => {
        // 100kB読み出す毎に呼ばれる
        const chunk = createChunk(data, chunkNum);
        request.setChunk(chunk);
        apiRequestStream.write(request);
        chunkNum++;
      })
      .on('error', () => {
        return reject(new Error('failed to read file.'));
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

// TODO: これから直す
export async function restoreCache(
  paths: string[],
  primaryKey: string,
  restoreKeys?: string[],
  s3Options?: S3ClientConfig,
  s3BucketName?: string,
): Promise<string | undefined> {
  return new Promise(async (resolve, reject) => {
    // 問題があればthrowされる
    checkPaths(paths);

    restoreKeys = restoreKeys || [];
    const keys = [primaryKey, ...restoreKeys];

    logDebug('Resolved Keys:');
    logDebug(JSON.stringify(keys));

    if (keys.length > 10) {
      reject(new ValidationError('Key Validation Error: Keys are limited to a maximum of 10.'));
    }
    for (const key of keys) {
      checkKey(key);
    }

    const compressionMethod = await getCompressionMethod();

    // path are needed to compute version
    const cacheEntry = await getCacheEntry(
      keys,
      paths,
      {
        compressionMethod,
      },
      s3Options,
      s3BucketName,
    );
    if (!cacheEntry?.archiveLocation && !cacheEntry?.cacheKey) {
      return resolve('Cache not found');
    }

    const archivePath = path.join(await createTempDirectory(), getCacheFileName(compressionMethod));
    logDebug(`Archive Path: ${archivePath}`);

    try {
      // Download the cache from the cache entry
      await downloadS3Cache(cacheEntry, archivePath, s3Options, s3BucketName);

      if (isDebug && !isSilent) {
        await listTar(archivePath, compressionMethod);
      }

      const archiveFileSize = getArchiveFileSizeInBytes(archivePath);
      logInfo(`Cache Size: ~${Math.round(archiveFileSize / (1024 * 1024))} MB (${archiveFileSize} B)`);

      await extractTar(archivePath, compressionMethod);
      logInfo('Cache restored successfully');
    } finally {
      // TODO:あとで消す
      // Try to delete the archive to save space
      try {
        await unlinkFile(archivePath);
      } catch (error) {
        reject(new Error(`Failed to delete archive: ${error}`));
      }
    }

    return cacheEntry.cacheKey;
  });
}
