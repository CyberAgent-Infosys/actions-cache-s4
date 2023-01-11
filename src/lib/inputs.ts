import { parseArgv } from '@/lib/parseArgv';
import { customGetInput as getInput } from '@/lib/actions';

const DEFAULT_AWS_ENDPOINT = 'https://s4.cycloud.io';
const DEFAULT_AWS_REGION = 'us-east-1';
const DEFAULT_S3_BUCKET_ENDPOINT = true;
const DEFAULT_S3_FORCE_PATH_STYLE = false;

export type Inputs = {
  path: string | unknown;
  key: string | unknown;
  restoreKeys: string | unknown;
  uploadChunkSize: number | unknown;
  awsS3Bucket: string | unknown;
  awsAccessKeyId: string | unknown;
  awsSecretAccessKey: string | unknown;
  awsRegion: string | unknown;
  awsEndpoint: string | unknown;
  awsS3BucketEndpoint: boolean | unknown;
  awsS3ForcePathStyle: boolean | unknown;
};

export const getInputs = (argv: string[]): Inputs => {
  const inputArgv = parseArgv(argv);

  // CLIからだと引数、Github Actions経由ではgetInputからパラメータを用意
  const path = inputArgv.path ?? getInput('path');
  const key = inputArgv.key ?? getInput('key');
  const restoreKeys = inputArgv['restore-keys'] ?? getInput('restore-keys');
  const uploadChunkSize = inputArgv['upload-chunk-size'] ?? getInput('upload-chunk-size');
  const awsS3Bucket = inputArgv['aws-s3-bucket'] ?? getInput('aws-s3-bucket');
  const awsAccessKeyId = inputArgv['aws-access-key-id'] ?? getInput('aws-access-key-id');
  const awsSecretAccessKey = inputArgv['aws-secret-access-key'] ?? getInput('aws-secret-access-key');
  const awsRegion = inputArgv['aws-region'] ?? getInput('aws-region') ?? DEFAULT_AWS_REGION;
  const awsEndpoint = inputArgv['aws-endpoint'] ?? getInput('aws-endpoint') ?? DEFAULT_AWS_ENDPOINT;
  const awsS3BucketEndpoint =
    inputArgv['aws-s3-bucket-endpoint'] ?? getInput('aws-s3-bucket-endpoint') ?? DEFAULT_S3_BUCKET_ENDPOINT;
  const awsS3ForcePathStyle =
    inputArgv['aws-s3-force-path-style'] ?? getInput('aws-s3-force-path-style') ?? DEFAULT_S3_FORCE_PATH_STYLE;

  return {
    path,
    key,
    restoreKeys,
    uploadChunkSize,
    awsS3Bucket,
    awsAccessKeyId,
    awsSecretAccessKey,
    awsRegion,
    awsEndpoint,
    awsS3BucketEndpoint,
    awsS3ForcePathStyle,
  };
};
