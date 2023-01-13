import { parseArgv } from '@/lib/parseArgv';
import { getInput, getInputAsInt, getInputAsBool, logDebug, getInputAsArray } from '@/lib/actions';

// TODO: 初期値見直し
const DEFAULT_AWS_ENDPOINT = 'https://s4.cycloud.io';
const DEFAULT_AWS_REGION = 'us-east-1';
const DEFAULT_S3_BUCKET_ENDPOINT = true;
const DEFAULT_S3_FORCE_PATH_STYLE = false;
const DEFAULT_UPLOAD_CHUNK_SIZE = 0;

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

export function getInputs(argv: string[]): Inputs {
  const inputArgv = parseArgv(argv);
  const requiredOption = { required: true };

  // CLIからだと引数、Github Actions経由ではgetInputからパラメータを用意
  const path = inputArgv.path ?? getInputAsArray('path', requiredOption);
  const key = inputArgv.key ?? getInput('key', requiredOption);
  const restoreKeys = inputArgv['restore-keys'] ?? getInput('restore-keys');
  const uploadChunkSize =
    inputArgv['upload-chunk-size'] ?? getInputAsInt('upload-chunk-size') ?? DEFAULT_UPLOAD_CHUNK_SIZE;
  const awsS3Bucket = inputArgv['aws-s3-bucket'] ?? getInput('aws-s3-bucket');
  const awsAccessKeyId = inputArgv['aws-access-key-id'] ?? getInput('aws-access-key-id');
  const awsSecretAccessKey = inputArgv['aws-secret-access-key'] ?? getInput('aws-secret-access-key');
  const awsRegion = inputArgv['aws-region'] ?? getInput('aws-region') ?? DEFAULT_AWS_REGION;
  const awsEndpoint = inputArgv['aws-endpoint'] ?? getInput('aws-endpoint') ?? DEFAULT_AWS_ENDPOINT;
  const awsS3BucketEndpoint =
    inputArgv['aws-s3-bucket-endpoint'] ?? getInputAsBool('aws-s3-bucket-endpoint') ?? DEFAULT_S3_BUCKET_ENDPOINT;
  const awsS3ForcePathStyle =
    inputArgv['aws-s3-force-path-style'] ?? getInputAsBool('aws-s3-force-path-style') ?? DEFAULT_S3_FORCE_PATH_STYLE;

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
