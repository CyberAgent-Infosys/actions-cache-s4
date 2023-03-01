import { credentials } from '@grpc/grpc-js';
import { getEnv } from '@/lib/env';
import { GatewayClient } from '@/gen/proto/actions_cache_gateway_grpc_pb.js';
import { ObjectInfo, Chunk } from '@/gen/proto/actions_cache_gateway_pb.js';
import { GatewayClientConfig } from '@/@types/input';

export const NO_MESSAGE_RECEIVED = 13;
export const CHUNK_SIZE = 100 * 1024;

export function createGatewayClient(): GatewayClient | undefined {
  const endpoint = getEnv('GATEWAY_END_POINT');
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

export function createChunk(data: string | Uint8Array, position: number): Chunk {
  const chunk = new Chunk();
  chunk.setData(data);
  chunk.setPosition(position);
  return chunk;
}
