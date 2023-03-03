export type InputParams = {
  path: string[];
  key: string;
  'restore-keys'?: string;
  'upload-chunk-size'?: number;
};

export type InputParamsKey = keyof InputParams;

export type Inputs = {
  path: string[] | undefined;
  key: string | undefined;
  restoreKeys: string[] | undefined;
  uploadChunkSize: number | undefined;
};

export type GatewayClientConfig = {
  paths: string[];
  key: string;
  restoreKeys: string[] | undefined;
  githubUrl: string;
  githubRepository: string;
  uploadChunkSize: number;
};
