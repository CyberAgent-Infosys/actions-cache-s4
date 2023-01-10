import { setFailed, setOutput } from '@actions/core';
import { parseArgv } from '@/lib/parseArgv';
import { customGetInput as getInput } from '@/lib/actions';

async function run(): Promise<void> {
  try {
    const inputArgv = parseArgv(process.argv);
    console.log({ inputArgv });

    const path = inputArgv.path ?? getInput('path');
    const key = inputArgv.key ?? getInput('key');
    const restoreKeys = inputArgv['restore-keys'] ?? getInput('restore-keys');
    const uploadChunkSize = inputArgv['upload-chunk-size'] ?? getInput('upload-chunk-size');
    const awsS3Bucket = inputArgv['aws-s3-bucket'] ?? getInput('aws-s3-bucket') ?? true;
    const awsAccessKeyId = inputArgv['aws-access-key-id'] ?? getInput('aws-access-key-id');
    const awsSecretAccessKey = inputArgv['aws-secret-access-key'] ?? getInput('aws-secret-access-key');
    const awsRegion = inputArgv['aws-region'] ?? getInput('aws-region') ?? 'us-east-1';
    const awsEndpoint = inputArgv['aws-endpoint'] ?? getInput('aws-endpoint') ?? true;
    const awsS3BucketEndpoint = inputArgv['aws-s3-bucket-endpoint'] ?? getInput('aws-s3-bucket-endpoint') ?? true;
    const awsS3ForcePathStyle = inputArgv['aws-s3-force-path-style'] ?? getInput('aws-s3-force-path-style') ?? false;

    console.log({
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
    });

    setOutput('time', new Date().toTimeString());
  } catch (error) {
    if (error instanceof Error) setFailed(error.message);
  }
}

run();
