import { saveCache as _saveCache, restoreCache as _restoreCache } from '@actions/cache';
import * as path from 'path';

import { S3ClientConfig } from '@aws-sdk/client-s3';
import { isDebug } from '@/lib/utils';
import { logDebug, logInfo } from '@/lib/actions/core';
import * as utils from '@/lib/actions/cacheUtils';
import { listTar, createTar } from '@/lib/actions/tar';
import * as cacheHttpClient from '@/lib/actions/cacheHttpClient';
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

// TODO:
export async function __saveCache(
  paths: string[],
  key: string,
  options: UploadOptions,
  s3ClientConfig?: S3ClientConfig,
  s3BucketName?: string | undefined,
): Promise<number | void> {
  if (isDebug) {
    logDebug('Skip save process.');
    return;
  }

  logInfo(`Cache saved with key: ${key}`);
  return _saveCache(paths, key, options, s3ClientConfig, s3BucketName);
}

export async function saveCache(
  paths: string[],
  key: string,
  options?: UploadOptions,
  s3Options?: S3ClientConfig,
  s3BucketName?: string,
): Promise<number> {
  if (isDebug) {
    logDebug('Skip save process.');
    return -1;
  }

  checkPaths(paths);
  checkKey(key);

  const compressionMethod = await utils.getCompressionMethod();
  let cacheId = 0;

  const cachePaths = await utils.resolvePaths(paths);
  logDebug('Cache Paths:');
  logDebug(`${JSON.stringify(cachePaths)}`);

  const archiveFolder = await utils.createTempDirectory();
  const archivePath = path.join(archiveFolder, utils.getCacheFileName(compressionMethod));

  logDebug(`Archive Path: ${archivePath}`);

  try {
    await createTar(archiveFolder, cachePaths, compressionMethod);
    if (isDebug) {
      await listTar(archivePath, compressionMethod);
    }
    const fileSizeLimit = 10 * 1024 * 1024 * 1024; // 10GB per repo limit
    const archiveFileSize = utils.getArchiveFileSizeInBytes(archivePath);
    logDebug(`File Size: ${archiveFileSize}`);

    // For GHES, this check will take place in ReserveCache API with enterprise file size limit
    if (archiveFileSize > fileSizeLimit && !utils.isGhes()) {
      throw new Error(
        `Cache size of ~${Math.round(
          archiveFileSize / (1024 * 1024),
        )} MB (${archiveFileSize} B) is over the 10GB limit, not saving cache.`,
      );
    }

    if (!(s3Options && s3BucketName)) {
      logDebug('Reserving Cache');
      const reserveCacheResponse = await cacheHttpClient.reserveCache(
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
    await cacheHttpClient.saveCache(cacheId, archivePath, key, options, s3Options, s3BucketName);
  } finally {
    // Try to delete the archive to save space
    try {
      await utils.unlinkFile(archivePath);
    } catch (error) {
      logDebug(`Failed to delete archive: ${error}`);
    }
  }

  return cacheId;
}

// TODO:
export async function restoreCache(
  paths: string[],
  primaryKey: string,
  restoreKeys: string[] | undefined,
  options: object | undefined,
  s3ClientConfig?: S3ClientConfig,
  s3BucketName?: string | undefined,
): Promise<string | void> {
  if (isDebug) {
    logDebug('Skip restore cache process.');
    return;
  }

  return _restoreCache(paths, primaryKey, restoreKeys, options, s3ClientConfig, s3BucketName);
}