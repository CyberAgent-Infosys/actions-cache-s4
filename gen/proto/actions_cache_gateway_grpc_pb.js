// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('@grpc/grpc-js');
var proto_actions_cache_gateway_pb = require('../proto/actions_cache_gateway_pb.js');

function serialize_cycloudio_gateway_RestoreCacheRequest(arg) {
  if (!(arg instanceof proto_actions_cache_gateway_pb.RestoreCacheRequest)) {
    throw new Error('Expected argument of type cycloudio.gateway.RestoreCacheRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_cycloudio_gateway_RestoreCacheRequest(buffer_arg) {
  return proto_actions_cache_gateway_pb.RestoreCacheRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_cycloudio_gateway_RestoreCacheResponse(arg) {
  if (!(arg instanceof proto_actions_cache_gateway_pb.RestoreCacheResponse)) {
    throw new Error('Expected argument of type cycloudio.gateway.RestoreCacheResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_cycloudio_gateway_RestoreCacheResponse(buffer_arg) {
  return proto_actions_cache_gateway_pb.RestoreCacheResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_cycloudio_gateway_UploadCacheRequest(arg) {
  if (!(arg instanceof proto_actions_cache_gateway_pb.UploadCacheRequest)) {
    throw new Error('Expected argument of type cycloudio.gateway.UploadCacheRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_cycloudio_gateway_UploadCacheRequest(buffer_arg) {
  return proto_actions_cache_gateway_pb.UploadCacheRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_cycloudio_gateway_UploadCacheResponse(arg) {
  if (!(arg instanceof proto_actions_cache_gateway_pb.UploadCacheResponse)) {
    throw new Error('Expected argument of type cycloudio.gateway.UploadCacheResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_cycloudio_gateway_UploadCacheResponse(buffer_arg) {
  return proto_actions_cache_gateway_pb.UploadCacheResponse.deserializeBinary(new Uint8Array(buffer_arg));
}


// API定義
var GatewayService = exports.GatewayService = {
  uploadCache: {
    path: '/cycloudio.gateway.Gateway/UploadCache',
    requestStream: true,
    responseStream: false,
    requestType: proto_actions_cache_gateway_pb.UploadCacheRequest,
    responseType: proto_actions_cache_gateway_pb.UploadCacheResponse,
    requestSerialize: serialize_cycloudio_gateway_UploadCacheRequest,
    requestDeserialize: deserialize_cycloudio_gateway_UploadCacheRequest,
    responseSerialize: serialize_cycloudio_gateway_UploadCacheResponse,
    responseDeserialize: deserialize_cycloudio_gateway_UploadCacheResponse,
  },
  restoreCache: {
    path: '/cycloudio.gateway.Gateway/RestoreCache',
    requestStream: false,
    responseStream: false,
    requestType: proto_actions_cache_gateway_pb.RestoreCacheRequest,
    responseType: proto_actions_cache_gateway_pb.RestoreCacheResponse,
    requestSerialize: serialize_cycloudio_gateway_RestoreCacheRequest,
    requestDeserialize: deserialize_cycloudio_gateway_RestoreCacheRequest,
    responseSerialize: serialize_cycloudio_gateway_RestoreCacheResponse,
    responseDeserialize: deserialize_cycloudio_gateway_RestoreCacheResponse,
  },
};

exports.GatewayClient = grpc.makeGenericClientConstructor(GatewayService);
