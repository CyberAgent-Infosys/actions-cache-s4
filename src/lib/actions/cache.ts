import * as path from 'path';
import { S3ClientConfig } from '@aws-sdk/client-s3';
import { isDebug } from '@/lib/utils';
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
import { downloadS3Cache, getCacheEntry, reserveCache, saveS3Cache } from '@/lib/actions/cacheHttpClient';
import { UploadOptions } from '@/lib/options';

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

export async function saveCache(
  paths: string[],
  key: string,
  options?: UploadOptions,
  s3Options?: S3ClientConfig,
  s3BucketName?: string,
): Promise<number> {
  // TODO: localで動くように考える
  if (isDebug) {
    logDebug('Skip save process.');
    return -1;
  }

  checkPaths(paths);
  checkKey(key);

  const compressionMethod = await getCompressionMethod();
  let cacheId = 0;

  const cachePaths = await resolvePaths(paths);
  logDebug('Cache Paths:');
  logDebug(`${JSON.stringify(cachePaths)}`);

  const archiveFolder = await createTempDirectory();
  const archivePath = path.join(archiveFolder, getCacheFileName(compressionMethod));

  logDebug(`Archive Path: ${archivePath}`);

  try {
    await createTar(archiveFolder, cachePaths, compressionMethod);
    if (isDebug) {
      await listTar(archivePath, compressionMethod);
    }
    const fileSizeLimit = 10 * 1024 * 1024 * 1024; // 10GB per repo limit
    const archiveFileSize = getArchiveFileSizeInBytes(archivePath);
    logDebug(`File Size: ${archiveFileSize}`);

    // For GHES, this check will take place in ReserveCache API with enterprise file size limit
    if (archiveFileSize > fileSizeLimit && !isGhes()) {
      throw new Error(
        `Cache size of ~${Math.round(
          archiveFileSize / (1024 * 1024),
        )} MB (${archiveFileSize} B) is over the 10GB limit, not saving cache.`,
      );
    }

    if (!(s3Options && s3BucketName)) {
      logDebug('Reserving Cache');
      const reserveCacheResponse = await reserveCache(
        key,
        paths,
        {
          compressionMethod,
          cacheSize: archiveFileSize,
        },
        s3Options,
        s3BucketName,
      );

      if (reserveCacheResponse?.result?.cacheId) {
        cacheId = reserveCacheResponse?.result?.cacheId;
      } else if (reserveCacheResponse?.statusCode === 400) {
        throw new Error(
          reserveCacheResponse?.error?.message ??
            `Cache size of ~${Math.round(
              archiveFileSize / (1024 * 1024),
            )} MB (${archiveFileSize} B) is over the data cap limit, not saving cache.`,
        );
      } else {
        throw new ReserveCacheError(
          `Unable to reserve cache with key ${key}, another job may be creating this cache. More details: ${reserveCacheResponse?.error?.message}`,
        );
      }
    }

    logDebug(`Saving Cache (ID: ${cacheId})`);
    await saveS3Cache(cacheId, archivePath, key, options, s3Options, s3BucketName);
  } finally {
    // Try to delete the archive to save space
    try {
      await unlinkFile(archivePath);
    } catch (error) {
      logDebug(`Failed to delete archive: ${error}`);
    }
  }

  return cacheId;
}

export async function restoreCache(
  paths: string[],
  primaryKey: string,
  restoreKeys?: string[],
  s3Options?: S3ClientConfig,
  s3BucketName?: string,
): Promise<string | undefined> {
  // if (isDebug) {
  //   logDebug('Skip restore cache process.');
  //   return;
  // }
  checkPaths(paths);

  restoreKeys = restoreKeys || [];
  const keys = [primaryKey, ...restoreKeys];

  logDebug('Resolved Keys:');
  logDebug(JSON.stringify(keys));

  if (keys.length > 10) {
    throw new ValidationError('Key Validation Error: Keys are limited to a maximum of 10.');
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
    // Cache not found
    return undefined;
  }

  const archivePath = path.join(await createTempDirectory(), getCacheFileName(compressionMethod));
  logDebug(`Archive Path: ${archivePath}`);

  try {
    // Download the cache from the cache entry
    await downloadS3Cache(cacheEntry, archivePath, s3Options, s3BucketName);

    if (isDebug) {
      await listTar(archivePath, compressionMethod);
    }

    const archiveFileSize = getArchiveFileSizeInBytes(archivePath);
    logInfo(`Cache Size: ~${Math.round(archiveFileSize / (1024 * 1024))} MB (${archiveFileSize} B)`);

    await extractTar(archivePath, compressionMethod);
    logInfo('Cache restored successfully');
  } finally {
    // Try to delete the archive to save space
    try {
      await unlinkFile(archivePath);
    } catch (error) {
      logDebug(`Failed to delete archive: ${error}`);
    }
  }

  return cacheEntry.cacheKey;
}
