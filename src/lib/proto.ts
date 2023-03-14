import { credentials } from '@grpc/grpc-js';
import { getEnv } from '@/lib/env';
import { GatewayClient } from '@/gen/proto/actions_cache_gateway_grpc_pb.js';
import { ObjectInfo } from '@/gen/proto/actions_cache_gateway_pb.js';
import { GatewayClientConfig } from '@/@types/input';

export function createGatewayClient(): GatewayClient | undefined {
  // TODO: gatewayのエンドポイントわかったら書換
  const endpoint = getEnv('GATEWAY_END_POINT') ?? '';
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
