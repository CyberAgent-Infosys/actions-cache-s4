import { CompressionMethod } from '@/lib/actions/constants';

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
