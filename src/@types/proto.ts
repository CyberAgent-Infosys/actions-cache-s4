import { ObjectInfo } from '@/gen/proto/actions_cache_gateway_pb';

export type GatewayClientConfig = ObjectInfo.AsObject & {
  paths: string[];
  restoreKeys: string[] | undefined;
  uploadChunkSize: number;
};
