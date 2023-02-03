import { Inputs } from '@/@types/input';
import { S3ClientConfig } from '@aws-sdk/client-s3';
import { getArgv } from '@/lib/argv';
import { getInput, getInputAsInt, getBooleanInput, logDebug, getInputAsArray } from '@/lib/actions/core';

// TODO: 初期値見直し
const DEFAULT_AWS_ENDPOINT = 'https://s4.cycloud.io';
const DEFAULT_AWS_REGION = 'us-east-1';
const DEFAULT_S3_BUCKET_ENDPOINT = true;
const DEFAULT_S3_FORCE_PATH_STYLE = true;
const DEFAULT_UPLOAD_CHUNK_SIZE = 0;

export function getInputs(argv: string[]): Inputs {
  const inputArgv = getArgv(argv);
  const requiredOption = { required: true };

  // CLIからだと引数、Github Actions経由ではgetInputからパラメータを用意
  const path = inputArgv.path ?? getInputAsArray('path', requiredOption);
  const key = inputArgv.key ?? getInput('key', requiredOption);
  const restoreKeys = inputArgv.restoreKeys ?? getInputAsArray('restore-keys');
  const uploadChunkSize = inputArgv.uploadChunkSize ?? getInputAsInt('upload-chunk-size') ?? DEFAULT_UPLOAD_CHUNK_SIZE;
  const awsS3Bucket = inputArgv.awsS3Bucket ?? getInput('aws-s3-bucket');
  const awsAccessKeyId = inputArgv.awsAccessKeyId ?? getInput('aws-access-key-id');
  const awsSecretAccessKey = inputArgv.awsSecretAccessKey ?? getInput('aws-secret-access-key');
  const awsRegion = inputArgv.awsRegion ?? getInput('aws-region') ?? DEFAULT_AWS_REGION;
  const awsEndpoint = inputArgv.awsEndpoint ?? getInput('aws-endpoint') ?? DEFAULT_AWS_ENDPOINT;
  const awsS3BucketEndpoint =
    inputArgv.awsS3BucketEndpoint ?? getBooleanInput('aws-s3-bucket-endpoint') ?? DEFAULT_S3_BUCKET_ENDPOINT;
  const awsS3ForcePathStyle =
    inputArgv.awsS3ForcePathStyle ?? getBooleanInput('aws-s3-force-path-style') ?? DEFAULT_S3_FORCE_PATH_STYLE;

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
}

export function getS3ClientConfigByInputs(inputs: Inputs): S3ClientConfig | undefined {
  // TODO: S3向けのパラメータの初期化を考える
  if (!inputs.awsS3Bucket) return undefined;

  logDebug('Enable S3 backend mode.');
  return {
    credentials: {
      accessKeyId: inputs.awsAccessKeyId,
      secretAccessKey: inputs.awsSecretAccessKey,
    },
    region: inputs.awsRegion,
    endpoint: inputs.awsEndpoint,
    bucketEndpoint: inputs.awsEndpoint,
    forcePathStyle: inputs.awsS3ForcePathStyle,
  } as S3ClientConfig;
}
