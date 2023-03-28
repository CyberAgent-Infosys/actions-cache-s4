import querystring from 'node:querystring';
import { credentials } from '@grpc/grpc-js';
import { Response } from 'node-fetch';
import { GatewayClientConfig } from '@/@types/proto';
import { GatewayClient } from '@/gen/proto/actions_cache_gateway_grpc_pb.js';
import {
  StartMultipartUploadCacheRequest,
  CompleteMultipartUploadCacheRequest,
  AbortMultipartUploadCacheRequest,
  RestoreCacheRequest,
  StartMultipartUploadCacheResponse,
  ObjectInfo,
  UploadedParts,
  RestoreCacheResponse,
} from '@/gen/proto/actions_cache_gateway_pb.js';
import { ApiRequestError } from '@/lib/actions/error';
import { getEnv } from '@/lib/env';

// TODO: gatewayのエンドポイントわかったら書換
const endpoint = getEnv('GATEWAY_END_POINT') ?? '';

export function createGatewayClient(): GatewayClient | undefined {
  return endpoint ? new GatewayClient(endpoint, credentials.createInsecure()) : undefined;
}

export function createMeta(config: GatewayClientConfig): ObjectInfo {
  const { githubRepository, githubUrl, key } = config;
  const meta = new ObjectInfo();
  meta.setGithubRepository(githubRepository);
  meta.setGithubUrl(githubUrl);
  meta.setKey(key);
  return meta;
}

export function createUploadedParts(etags: UploadedParts.AsObject[]): UploadedParts[] {
  return etags.map(etag => {
    const parts = new UploadedParts();
    parts.setETag(etag.eTag);
    parts.setPartNumber(etag.partNumber);
    return parts;
  });
}

export function startMultipartUploadCacheRequest(
  config: GatewayClientConfig,
  totalPart: number,
): StartMultipartUploadCacheRequest {
  const request = new StartMultipartUploadCacheRequest();
  const meta = createMeta(config);
  request.setMeta(meta);
  request.setTotalPart(totalPart);
  return request;
}

export function completeMultipartUploadCacheRequest(
  config: GatewayClientConfig,
  uploadId: string,
  uploadKey: string,
  partsList: UploadedParts[],
): CompleteMultipartUploadCacheRequest {
  const request = new CompleteMultipartUploadCacheRequest();
  request.setUploadId(uploadId);
  request.setUploadKey(uploadKey);
  request.setPartsList(partsList);
  const meta = createMeta(config);
  request.setMeta(meta);
  return request;
}

export function abortMultipartUploadCacheRequest(
  config: GatewayClientConfig,
  uploadId: string,
  uploadKey: string,
): AbortMultipartUploadCacheRequest {
  const request = new AbortMultipartUploadCacheRequest();
  request.setUploadId(uploadId);
  request.setUploadKey(uploadKey);
  const meta = createMeta(config);
  request.setMeta(meta);
  return request;
}

// path are needed to compute version
export function createRestoreCacheRequest(config: GatewayClientConfig, keys: string[]): RestoreCacheRequest {
  const request = new RestoreCacheRequest();
  const meta = createMeta(config);
  request.setMeta(meta);
  request.setRestoreKeysList(keys);
  return request;
}

export async function restoreCache(
  client: GatewayClient,
  request: RestoreCacheRequest,
): Promise<RestoreCacheResponse.AsObject | undefined> {
  return new Promise((resolve, reject) =>
    client.restoreCache(request, (err, res) => {
      if (err) {
        reject(
          err instanceof Error
            ? new ApiRequestError(`Resotre Cache Request Error: ${err?.details ?? err.message}.`)
            : err,
        );
      }

      resolve(res?.toObject());
    }),
  );
}

export async function startMultipartUploadCache(
  client: GatewayClient,
  request: StartMultipartUploadCacheRequest,
): Promise<StartMultipartUploadCacheResponse.AsObject | undefined> {
  return new Promise((resolve, reject) =>
    client.startMultipartUploadCache(request, (err, res) => {
      if (err) {
        reject(
          err instanceof Error
            ? new ApiRequestError(`Multipart Uplaod Cache Request Error: ${err?.details ?? err.message}.`)
            : err,
        );
      }
      resolve(res?.toObject());
    }),
  );
}

export async function abortMultipartUploadCache(
  client: GatewayClient,
  request: AbortMultipartUploadCacheRequest,
): Promise<void> {
  return new Promise((resolve, reject) =>
    client.abortMultipartUploadCache(request, err => {
      if (err) {
        reject(
          err instanceof Error ? new ApiRequestError(`Abort Request Error: ${err?.details ?? err.message}.`) : err,
        );
      }
      return resolve();
    }),
  );
}

export async function completeMultipartUploadCache(
  client: GatewayClient,
  request: CompleteMultipartUploadCacheRequest,
): Promise<void> {
  return new Promise((resolve, reject) =>
    client.completeMultipartUploadCache(request, err => {
      if (err) {
        reject(
          err instanceof Error ? new ApiRequestError(`Complete Request Error: ${err?.details ?? err.message}.`) : err,
        );
      }
      resolve();
    }),
  );
}

export async function uploadProc(request: Promise<Response>): Promise<UploadedParts.AsObject> {
  return new Promise(async (resolve, reject) => {
    const res: Response = await request;
    if (!res.ok) {
      reject(new ApiRequestError(`Failed to complete multipart upload: ${res.status} ${res.statusText} `));
    }

    const query = querystring.parse(res.url);
    const partNumber = query.partNumber;
    if (!partNumber) return reject(new ApiRequestError(`Failed to get partNumber for part ${partNumber}.`));
    const eTag = (res.headers.get('ETag') ?? '').replaceAll('"', '');
    if (!eTag) return reject(new ApiRequestError(`Failed to get eTag for part ${partNumber}.`));
    return resolve({ partNumber: Number(partNumber), eTag });
  });
}
