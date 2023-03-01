export type InputParams = {
  path: string[];
  key: string;
  'restore-keys'?: string;
  'upload-chunk-size'?: number;
  'aws-s3-bucket': string;
  'aws-access-key-id': string;
  'aws-secret-access-key': string;
};

export type InputParamsKey = keyof InputParams;

export type Inputs = {
  path: string[] | undefined;
  key: string | undefined;
  restoreKeys: string[] | undefined;
  uploadChunkSize: number | undefined;
  awsS3Bucket: string | undefined;
  awsAccessKeyId: string | undefined;
  awsSecretAccessKey: string | undefined;
};

export type GatewayClientConfig = {
  paths: string[];
  key: string;
  githubUrl: string;
  githubRepository: string;
};
