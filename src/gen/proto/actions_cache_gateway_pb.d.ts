// package: cycloudio.gateway
// file: proto/actions_cache_gateway.proto

import * as jspb from "google-protobuf";

export class ObjectInfo extends jspb.Message {
  getGithubUrl(): string;
  setGithubUrl(value: string): void;

  getGithubRepository(): string;
  setGithubRepository(value: string): void;

  getKey(): string;
  setKey(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ObjectInfo.AsObject;
  static toObject(includeInstance: boolean, msg: ObjectInfo): ObjectInfo.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ObjectInfo, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ObjectInfo;
  static deserializeBinaryFromReader(message: ObjectInfo, reader: jspb.BinaryReader): ObjectInfo;
}

export namespace ObjectInfo {
  export type AsObject = {
    githubUrl: string,
    githubRepository: string,
    key: string,
  }
}

export class UploadCacheRequest extends jspb.Message {
  hasMeta(): boolean;
  clearMeta(): void;
  getMeta(): ObjectInfo | undefined;
  setMeta(value?: ObjectInfo): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UploadCacheRequest.AsObject;
  static toObject(includeInstance: boolean, msg: UploadCacheRequest): UploadCacheRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: UploadCacheRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UploadCacheRequest;
  static deserializeBinaryFromReader(message: UploadCacheRequest, reader: jspb.BinaryReader): UploadCacheRequest;
}

export namespace UploadCacheRequest {
  export type AsObject = {
    meta?: ObjectInfo.AsObject,
  }
}

export class UploadCacheResponse extends jspb.Message {
  getPreSignedUrl(): string;
  setPreSignedUrl(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UploadCacheResponse.AsObject;
  static toObject(includeInstance: boolean, msg: UploadCacheResponse): UploadCacheResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: UploadCacheResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UploadCacheResponse;
  static deserializeBinaryFromReader(message: UploadCacheResponse, reader: jspb.BinaryReader): UploadCacheResponse;
}

export namespace UploadCacheResponse {
  export type AsObject = {
    preSignedUrl: string,
  }
}

export class RestoreCacheRequest extends jspb.Message {
  hasMeta(): boolean;
  clearMeta(): void;
  getMeta(): ObjectInfo | undefined;
  setMeta(value?: ObjectInfo): void;

  clearRestoreKeysList(): void;
  getRestoreKeysList(): Array<string>;
  setRestoreKeysList(value: Array<string>): void;
  addRestoreKeys(value: string, index?: number): string;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RestoreCacheRequest.AsObject;
  static toObject(includeInstance: boolean, msg: RestoreCacheRequest): RestoreCacheRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: RestoreCacheRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RestoreCacheRequest;
  static deserializeBinaryFromReader(message: RestoreCacheRequest, reader: jspb.BinaryReader): RestoreCacheRequest;
}

export namespace RestoreCacheRequest {
  export type AsObject = {
    meta?: ObjectInfo.AsObject,
    restoreKeysList: Array<string>,
  }
}

export class RestoreCacheResponse extends jspb.Message {
  getPreSignedUrl(): string;
  setPreSignedUrl(value: string): void;

  getCacheKey(): string;
  setCacheKey(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RestoreCacheResponse.AsObject;
  static toObject(includeInstance: boolean, msg: RestoreCacheResponse): RestoreCacheResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: RestoreCacheResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RestoreCacheResponse;
  static deserializeBinaryFromReader(message: RestoreCacheResponse, reader: jspb.BinaryReader): RestoreCacheResponse;
}

export namespace RestoreCacheResponse {
  export type AsObject = {
    preSignedUrl: string,
    cacheKey: string,
  }
}

