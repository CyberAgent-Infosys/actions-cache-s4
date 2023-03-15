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
