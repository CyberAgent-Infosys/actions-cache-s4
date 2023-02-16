import { Inputs } from '@/@types/input';
import { S3ClientConfig } from '@aws-sdk/client-s3';
import { getArgv } from '@/lib/argv';
import { getInput, getInputAsInt, logDebug, getInputAsArray } from '@/lib/actions/core';
import { defaultEndpoint, defaultUploadChunkSize } from '@/lib/actions/constants';

export function getInputs(argv: string[]): Inputs {
  const inputArgv = getArgv(argv);
  const requiredOption = { required: true };

  // CLIからだと引数、Github Actions経由ではgetInputからパラメータを用意
  const path = inputArgv.path ?? getInputAsArray('path', requiredOption);
  const key = inputArgv.key ?? getInput('key', requiredOption);
  const restoreKeys = inputArgv.restoreKeys ?? getInputAsArray('restore-keys');
  const uploadChunkSize = inputArgv.uploadChunkSize ?? getInputAsInt('upload-chunk-size') ?? defaultUploadChunkSize;
  const awsS3Bucket = inputArgv.awsS3Bucket ?? getInput('aws-s3-bucket');
  const awsAccessKeyId = inputArgv.awsAccessKeyId ?? getInput('aws-access-key-id');
  const awsSecretAccessKey = inputArgv.awsSecretAccessKey ?? getInput('aws-secret-access-key');

  return {
    path,
    key,
    restoreKeys,
    uploadChunkSize,
    awsS3Bucket,
    awsAccessKeyId,
    awsSecretAccessKey,
  };
}

export function getS3ClientConfigByInputs(inputs: Inputs): S3ClientConfig | undefined {
  if (!inputs.awsS3Bucket) return undefined;

  logDebug('Enable S3 backend mode.');
  return {
    credentials: {
      accessKeyId: inputs.awsAccessKeyId,
      secretAccessKey: inputs.awsSecretAccessKey,
    },
    endpoint: defaultEndpoint,
    region: 'none', // dummyの文字入れないとアップロードできない
    forcePathStyle: true,
  } as S3ClientConfig;
}
