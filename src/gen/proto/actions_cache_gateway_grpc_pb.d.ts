// GENERATED CODE -- DO NOT EDIT!

// package: cycloudio.gateway
// file: proto/actions_cache_gateway.proto

import * as proto_actions_cache_gateway_pb from "../proto/actions_cache_gateway_pb";
import * as google_protobuf_empty_pb from "google-protobuf/google/protobuf/empty_pb";
import * as grpc from "@grpc/grpc-js";

interface IGatewayService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
  uploadCache: grpc.MethodDefinition<proto_actions_cache_gateway_pb.UploadCacheRequest, proto_actions_cache_gateway_pb.UploadCacheResponse>;
  restoreCache: grpc.MethodDefinition<proto_actions_cache_gateway_pb.RestoreCacheRequest, proto_actions_cache_gateway_pb.RestoreCacheResponse>;
  startMultipartUploadCache: grpc.MethodDefinition<proto_actions_cache_gateway_pb.StartMultipartUploadCacheRequest, proto_actions_cache_gateway_pb.StartMultipartUploadCacheResponse>;
  completeMultipartUploadCache: grpc.MethodDefinition<proto_actions_cache_gateway_pb.CompleteMultipartUploadCacheRequest, google_protobuf_empty_pb.Empty>;
  abortMultipartUploadCache: grpc.MethodDefinition<proto_actions_cache_gateway_pb.AbortMultipartUploadCacheRequest, google_protobuf_empty_pb.Empty>;
}

export const GatewayService: IGatewayService;

export interface IGatewayServer extends grpc.UntypedServiceImplementation {
  uploadCache: grpc.handleUnaryCall<proto_actions_cache_gateway_pb.UploadCacheRequest, proto_actions_cache_gateway_pb.UploadCacheResponse>;
  restoreCache: grpc.handleUnaryCall<proto_actions_cache_gateway_pb.RestoreCacheRequest, proto_actions_cache_gateway_pb.RestoreCacheResponse>;
  startMultipartUploadCache: grpc.handleUnaryCall<proto_actions_cache_gateway_pb.StartMultipartUploadCacheRequest, proto_actions_cache_gateway_pb.StartMultipartUploadCacheResponse>;
  completeMultipartUploadCache: grpc.handleUnaryCall<proto_actions_cache_gateway_pb.CompleteMultipartUploadCacheRequest, google_protobuf_empty_pb.Empty>;
  abortMultipartUploadCache: grpc.handleUnaryCall<proto_actions_cache_gateway_pb.AbortMultipartUploadCacheRequest, google_protobuf_empty_pb.Empty>;
}

export class GatewayClient extends grpc.Client {
  constructor(address: string, credentials: grpc.ChannelCredentials, options?: object);
  uploadCache(argument: proto_actions_cache_gateway_pb.UploadCacheRequest, callback: grpc.requestCallback<proto_actions_cache_gateway_pb.UploadCacheResponse>): grpc.ClientUnaryCall;
  uploadCache(argument: proto_actions_cache_gateway_pb.UploadCacheRequest, metadataOrOptions: grpc.Metadata | grpc.CallOptions | null, callback: grpc.requestCallback<proto_actions_cache_gateway_pb.UploadCacheResponse>): grpc.ClientUnaryCall;
  uploadCache(argument: proto_actions_cache_gateway_pb.UploadCacheRequest, metadata: grpc.Metadata | null, options: grpc.CallOptions | null, callback: grpc.requestCallback<proto_actions_cache_gateway_pb.UploadCacheResponse>): grpc.ClientUnaryCall;
  restoreCache(argument: proto_actions_cache_gateway_pb.RestoreCacheRequest, callback: grpc.requestCallback<proto_actions_cache_gateway_pb.RestoreCacheResponse>): grpc.ClientUnaryCall;
  restoreCache(argument: proto_actions_cache_gateway_pb.RestoreCacheRequest, metadataOrOptions: grpc.Metadata | grpc.CallOptions | null, callback: grpc.requestCallback<proto_actions_cache_gateway_pb.RestoreCacheResponse>): grpc.ClientUnaryCall;
  restoreCache(argument: proto_actions_cache_gateway_pb.RestoreCacheRequest, metadata: grpc.Metadata | null, options: grpc.CallOptions | null, callback: grpc.requestCallback<proto_actions_cache_gateway_pb.RestoreCacheResponse>): grpc.ClientUnaryCall;
  startMultipartUploadCache(argument: proto_actions_cache_gateway_pb.StartMultipartUploadCacheRequest, callback: grpc.requestCallback<proto_actions_cache_gateway_pb.StartMultipartUploadCacheResponse>): grpc.ClientUnaryCall;
  startMultipartUploadCache(argument: proto_actions_cache_gateway_pb.StartMultipartUploadCacheRequest, metadataOrOptions: grpc.Metadata | grpc.CallOptions | null, callback: grpc.requestCallback<proto_actions_cache_gateway_pb.StartMultipartUploadCacheResponse>): grpc.ClientUnaryCall;
  startMultipartUploadCache(argument: proto_actions_cache_gateway_pb.StartMultipartUploadCacheRequest, metadata: grpc.Metadata | null, options: grpc.CallOptions | null, callback: grpc.requestCallback<proto_actions_cache_gateway_pb.StartMultipartUploadCacheResponse>): grpc.ClientUnaryCall;
  completeMultipartUploadCache(argument: proto_actions_cache_gateway_pb.CompleteMultipartUploadCacheRequest, callback: grpc.requestCallback<google_protobuf_empty_pb.Empty>): grpc.ClientUnaryCall;
  completeMultipartUploadCache(argument: proto_actions_cache_gateway_pb.CompleteMultipartUploadCacheRequest, metadataOrOptions: grpc.Metadata | grpc.CallOptions | null, callback: grpc.requestCallback<google_protobuf_empty_pb.Empty>): grpc.ClientUnaryCall;
  completeMultipartUploadCache(argument: proto_actions_cache_gateway_pb.CompleteMultipartUploadCacheRequest, metadata: grpc.Metadata | null, options: grpc.CallOptions | null, callback: grpc.requestCallback<google_protobuf_empty_pb.Empty>): grpc.ClientUnaryCall;
  abortMultipartUploadCache(argument: proto_actions_cache_gateway_pb.AbortMultipartUploadCacheRequest, callback: grpc.requestCallback<google_protobuf_empty_pb.Empty>): grpc.ClientUnaryCall;
  abortMultipartUploadCache(argument: proto_actions_cache_gateway_pb.AbortMultipartUploadCacheRequest, metadataOrOptions: grpc.Metadata | grpc.CallOptions | null, callback: grpc.requestCallback<google_protobuf_empty_pb.Empty>): grpc.ClientUnaryCall;
  abortMultipartUploadCache(argument: proto_actions_cache_gateway_pb.AbortMultipartUploadCacheRequest, metadata: grpc.Metadata | null, options: grpc.CallOptions | null, callback: grpc.requestCallback<google_protobuf_empty_pb.Empty>): grpc.ClientUnaryCall;
}
