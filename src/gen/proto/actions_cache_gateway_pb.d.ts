// package: cycloudio.gateway
// file: proto/actions_cache_gateway.proto

import * as jspb from "google-protobuf";
import * as google_protobuf_empty_pb from "google-protobuf/google/protobuf/empty_pb";

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

export class UploadedParts extends jspb.Message {
  getPartNumber(): number;
  setPartNumber(value: number): void;

  getETag(): string;
  setETag(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UploadedParts.AsObject;
  static toObject(includeInstance: boolean, msg: UploadedParts): UploadedParts.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: UploadedParts, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UploadedParts;
  static deserializeBinaryFromReader(message: UploadedParts, reader: jspb.BinaryReader): UploadedParts;
}

export namespace UploadedParts {
  export type AsObject = {
    partNumber: number,
    eTag: string,
  }
}

export class StartMultipartUploadCacheRequest extends jspb.Message {
  hasMeta(): boolean;
  clearMeta(): void;
  getMeta(): ObjectInfo | undefined;
  setMeta(value?: ObjectInfo): void;

  getTotalPart(): number;
  setTotalPart(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): StartMultipartUploadCacheRequest.AsObject;
  static toObject(includeInstance: boolean, msg: StartMultipartUploadCacheRequest): StartMultipartUploadCacheRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: StartMultipartUploadCacheRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): StartMultipartUploadCacheRequest;
  static deserializeBinaryFromReader(message: StartMultipartUploadCacheRequest, reader: jspb.BinaryReader): StartMultipartUploadCacheRequest;
}

export namespace StartMultipartUploadCacheRequest {
  export type AsObject = {
    meta?: ObjectInfo.AsObject,
    totalPart: number,
  }
}

export class StartMultipartUploadCacheResponse extends jspb.Message {
  getUploadId(): string;
  setUploadId(value: string): void;

  getUploadKey(): string;
  setUploadKey(value: string): void;

  getContentType(): string;
  setContentType(value: string): void;

  clearPreSignedUrlsList(): void;
  getPreSignedUrlsList(): Array<string>;
  setPreSignedUrlsList(value: Array<string>): void;
  addPreSignedUrls(value: string, index?: number): string;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): StartMultipartUploadCacheResponse.AsObject;
  static toObject(includeInstance: boolean, msg: StartMultipartUploadCacheResponse): StartMultipartUploadCacheResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: StartMultipartUploadCacheResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): StartMultipartUploadCacheResponse;
  static deserializeBinaryFromReader(message: StartMultipartUploadCacheResponse, reader: jspb.BinaryReader): StartMultipartUploadCacheResponse;
}

export namespace StartMultipartUploadCacheResponse {
  export type AsObject = {
    uploadId: string,
    uploadKey: string,
    contentType: string,
    preSignedUrlsList: Array<string>,
  }
}

export class CompleteMultipartUploadCacheRequest extends jspb.Message {
  getUploadId(): string;
  setUploadId(value: string): void;

  getUploadKey(): string;
  setUploadKey(value: string): void;

  clearPartsList(): void;
  getPartsList(): Array<UploadedParts>;
  setPartsList(value: Array<UploadedParts>): void;
  addParts(value?: UploadedParts, index?: number): UploadedParts;

  hasMeta(): boolean;
  clearMeta(): void;
  getMeta(): ObjectInfo | undefined;
  setMeta(value?: ObjectInfo): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CompleteMultipartUploadCacheRequest.AsObject;
  static toObject(includeInstance: boolean, msg: CompleteMultipartUploadCacheRequest): CompleteMultipartUploadCacheRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CompleteMultipartUploadCacheRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CompleteMultipartUploadCacheRequest;
  static deserializeBinaryFromReader(message: CompleteMultipartUploadCacheRequest, reader: jspb.BinaryReader): CompleteMultipartUploadCacheRequest;
}

export namespace CompleteMultipartUploadCacheRequest {
  export type AsObject = {
    uploadId: string,
    uploadKey: string,
    partsList: Array<UploadedParts.AsObject>,
    meta?: ObjectInfo.AsObject,
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

export class AbortMultipartUploadCacheRequest extends jspb.Message {
  getUploadId(): string;
  setUploadId(value: string): void;

  getUploadKey(): string;
  setUploadKey(value: string): void;

  hasMeta(): boolean;
  clearMeta(): void;
  getMeta(): ObjectInfo | undefined;
  setMeta(value?: ObjectInfo): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AbortMultipartUploadCacheRequest.AsObject;
  static toObject(includeInstance: boolean, msg: AbortMultipartUploadCacheRequest): AbortMultipartUploadCacheRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: AbortMultipartUploadCacheRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AbortMultipartUploadCacheRequest;
  static deserializeBinaryFromReader(message: AbortMultipartUploadCacheRequest, reader: jspb.BinaryReader): AbortMultipartUploadCacheRequest;
}

export namespace AbortMultipartUploadCacheRequest {
  export type AsObject = {
    uploadId: string,
    uploadKey: string,
    meta?: ObjectInfo.AsObject,
  }
}

