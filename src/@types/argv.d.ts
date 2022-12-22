export type InputParams = {
  path: string;
  key: string;
  'restore-keys'?: string | undefined;
  'upload-chunk-size'?: number | undefined;
  'aws-s3-bucket': string;
  'aws-access-key-id': string;
  'aws-secret-access-key': string;
  'aws-region'?: string | undefined;
  'aws-endpoint'?: string;
  'aws-s3-bucket-endpoint'?: boolean;
  'aws-s3-force-path-style'?: boolean;
};

export type InputName = keyof InputParams;

export type InputValue = string | number | boolean | undefined;
