export type InputParams = {
  path: string[];
  key: string;
  'restore-keys'?: string;
  'upload-chunk-size'?: number;
  'aws-s3-bucket': string;
  'aws-access-key-id': string;
  'aws-secret-access-key': string;
  'aws-region'?: string;
  'aws-endpoint'?: string;
  'aws-s3-bucket-endpoint'?: boolean;
  'aws-s3-force-path-style'?: boolean;
};

export type InputKey = keyof InputParams;

export type Inputs = {
  path: string[] | undefined;
  key: string | undefined;
  restoreKeys: string | undefined;
  uploadChunkSize: number | undefined;
  awsS3Bucket: string | undefined;
  awsAccessKeyId: string | undefined;
  awsSecretAccessKey: string | undefined;
  awsRegion: string | undefined;
  awsEndpoint: string | undefined;
  awsS3BucketEndpoint: boolean | undefined;
  awsS3ForcePathStyle: boolean | undefined;
};
