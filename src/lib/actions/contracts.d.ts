import { TypedResponse } from '@actions/http-client/lib/interfaces';
import { HttpClientError } from '@actions/http-client';
import { CompressionMethod } from '@/lib/actions/constants';

export interface ITypedResponseWithError<T> extends TypedResponse<T> {
  error?: HttpClientError;
}

export interface ArtifactCacheEntry {
  cacheKey?: string;
  scope?: string;
  creationTime?: string;
  archiveLocation?: string;
}

export interface InternalCacheOptions {
  compressionMethod?: CompressionMethod;
  cacheSize?: number;
}
