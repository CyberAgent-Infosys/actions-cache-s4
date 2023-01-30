import { logDebug } from '@/lib/actions/core';

/**
 * Options to control cache upload
 */
export interface UploadOptions {
  /**
   * Number of parallel cache upload
   *
   * @default 4
   */
  uploadConcurrency?: number;
  /**
   * Maximum chunk size in bytes for cache upload
   * @default 32MB
   */
  uploadChunkSize?: number;
}

/**
 * Returns a copy of the upload options with defaults filled in.
 *
 * @param copy the original upload options
 */
export function getUploadOptions(copy?: UploadOptions): UploadOptions {
  const result: UploadOptions = {
    uploadConcurrency: 4,
    uploadChunkSize: 32 * 1024 * 1024,
  };

  if (copy) {
    if (typeof copy.uploadConcurrency === 'number') {
      result.uploadConcurrency = copy.uploadConcurrency;
    }

    if (typeof copy.uploadChunkSize === 'number') {
      result.uploadChunkSize = copy.uploadChunkSize;
    }
  }

  logDebug(`Upload concurrency: ${result.uploadConcurrency}`);
  logDebug(`Upload chunk size: ${result.uploadChunkSize}`);

  return result;
}
