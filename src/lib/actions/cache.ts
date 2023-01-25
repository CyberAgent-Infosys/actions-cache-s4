import { saveCache as _saveCache, restoreCache as _restoreCache } from '@actions/cache';

import { S3ClientConfig } from '@aws-sdk/client-s3';
import { isDebug } from '@/lib/utils';
import { logDebug, logInfo } from '@/lib/actions/core';

export interface UploadOptions {
  uploadConcurrency?: number;
  uploadChunkSize?: number;
}

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

// TODO:
export async function saveCache(
  paths: string[],
  primaryKey: string,
  options: UploadOptions,
  s3ClientConfig?: S3ClientConfig,
  s3BucketName?: string | undefined,
): Promise<number | void> {
  if (isDebug) {
    logDebug('Skip save process.');
    return;
  }

  logInfo(`Cache saved with key: ${primaryKey}`);
  return _saveCache(paths, primaryKey, options, s3ClientConfig, s3BucketName);
}

// TODO:
export async function restoreCache(
  path: string[],
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

  return _restoreCache(path, primaryKey, restoreKeys, options, s3ClientConfig, s3BucketName);
}
