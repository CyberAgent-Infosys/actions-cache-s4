// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('@grpc/grpc-js');
var proto_actions_cache_gateway_pb = require('../proto/actions_cache_gateway_pb.js');
var google_protobuf_empty_pb = require('google-protobuf/google/protobuf/empty_pb.js');

function serialize_cycloudio_gateway_AbortMultipartUploadCacheRequest(arg) {
  if (!(arg instanceof proto_actions_cache_gateway_pb.AbortMultipartUploadCacheRequest)) {
    throw new Error('Expected argument of type cycloudio.gateway.AbortMultipartUploadCacheRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_cycloudio_gateway_AbortMultipartUploadCacheRequest(buffer_arg) {
  return proto_actions_cache_gateway_pb.AbortMultipartUploadCacheRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_cycloudio_gateway_CompleteMultipartUploadCacheRequest(arg) {
  if (!(arg instanceof proto_actions_cache_gateway_pb.CompleteMultipartUploadCacheRequest)) {
    throw new Error('Expected argument of type cycloudio.gateway.CompleteMultipartUploadCacheRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_cycloudio_gateway_CompleteMultipartUploadCacheRequest(buffer_arg) {
  return proto_actions_cache_gateway_pb.CompleteMultipartUploadCacheRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

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

function serialize_cycloudio_gateway_StartMultipartUploadCacheRequest(arg) {
  if (!(arg instanceof proto_actions_cache_gateway_pb.StartMultipartUploadCacheRequest)) {
    throw new Error('Expected argument of type cycloudio.gateway.StartMultipartUploadCacheRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_cycloudio_gateway_StartMultipartUploadCacheRequest(buffer_arg) {
  return proto_actions_cache_gateway_pb.StartMultipartUploadCacheRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_cycloudio_gateway_StartMultipartUploadCacheResponse(arg) {
  if (!(arg instanceof proto_actions_cache_gateway_pb.StartMultipartUploadCacheResponse)) {
    throw new Error('Expected argument of type cycloudio.gateway.StartMultipartUploadCacheResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_cycloudio_gateway_StartMultipartUploadCacheResponse(buffer_arg) {
  return proto_actions_cache_gateway_pb.StartMultipartUploadCacheResponse.deserializeBinary(new Uint8Array(buffer_arg));
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

function serialize_google_protobuf_Empty(arg) {
  if (!(arg instanceof google_protobuf_empty_pb.Empty)) {
    throw new Error('Expected argument of type google.protobuf.Empty');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_google_protobuf_Empty(buffer_arg) {
  return google_protobuf_empty_pb.Empty.deserializeBinary(new Uint8Array(buffer_arg));
}


var GatewayService = exports.GatewayService = {
  uploadCache: {
    path: '/cycloudio.gateway.Gateway/UploadCache',
    requestStream: false,
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
  startMultipartUploadCache: {
    path: '/cycloudio.gateway.Gateway/StartMultipartUploadCache',
    requestStream: false,
    responseStream: false,
    requestType: proto_actions_cache_gateway_pb.StartMultipartUploadCacheRequest,
    responseType: proto_actions_cache_gateway_pb.StartMultipartUploadCacheResponse,
    requestSerialize: serialize_cycloudio_gateway_StartMultipartUploadCacheRequest,
    requestDeserialize: deserialize_cycloudio_gateway_StartMultipartUploadCacheRequest,
    responseSerialize: serialize_cycloudio_gateway_StartMultipartUploadCacheResponse,
    responseDeserialize: deserialize_cycloudio_gateway_StartMultipartUploadCacheResponse,
  },
  completeMultipartUploadCache: {
    path: '/cycloudio.gateway.Gateway/CompleteMultipartUploadCache',
    requestStream: false,
    responseStream: false,
    requestType: proto_actions_cache_gateway_pb.CompleteMultipartUploadCacheRequest,
    responseType: google_protobuf_empty_pb.Empty,
    requestSerialize: serialize_cycloudio_gateway_CompleteMultipartUploadCacheRequest,
    requestDeserialize: deserialize_cycloudio_gateway_CompleteMultipartUploadCacheRequest,
    responseSerialize: serialize_google_protobuf_Empty,
    responseDeserialize: deserialize_google_protobuf_Empty,
  },
  abortMultipartUploadCache: {
    path: '/cycloudio.gateway.Gateway/AbortMultipartUploadCache',
    requestStream: false,
    responseStream: false,
    requestType: proto_actions_cache_gateway_pb.AbortMultipartUploadCacheRequest,
    responseType: google_protobuf_empty_pb.Empty,
    requestSerialize: serialize_cycloudio_gateway_AbortMultipartUploadCacheRequest,
    requestDeserialize: deserialize_cycloudio_gateway_AbortMultipartUploadCacheRequest,
    responseSerialize: serialize_google_protobuf_Empty,
    responseDeserialize: deserialize_google_protobuf_Empty,
  },
};

exports.GatewayClient = grpc.makeGenericClientConstructor(GatewayService);
