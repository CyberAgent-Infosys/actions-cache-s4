import { setFailed, setOutput } from '@actions/core';
import { parseArgv } from '@/lib/parseArgv';
import { customGetInput } from '@/lib/actions';

async function run(): Promise<void> {
  try {
    const inputArgv = parseArgv(process.argv);
    console.log({ inputArgv });

    // TODO: 初期化
    const path = inputArgv.path ?? customGetInput('path');
    const key = inputArgv.key ?? customGetInput('key');
    const restoreKeys = inputArgv['restore-keys'] ?? customGetInput('restore-keys');
    const uploadChunkSize = inputArgv['upload-chunk-size'] ?? customGetInput('upload-chunk-size');
    const awsEndpoint = inputArgv['aws-endpoint'] ?? customGetInput('aws-endpoint') ?? true;
    const awsRegion = inputArgv['aws-region'] ?? customGetInput('aws-region') ?? true;

    const s3BucketEndpoint = inputArgv['aws-s3-bucket-endpoint'] ?? customGetInput('aws-s3-bucket-endpoint') ?? true;
    const s3ForcePathStyle = inputArgv['aws-s3-force-path-style'] ?? customGetInput('aws-s3-force-path-style') ?? false;

    console.log({
      path,
      key,
      restoreKeys,
      uploadChunkSize,
      awsRegion,
      awsEndpoint,
      s3BucketEndpoint,
      s3ForcePathStyle,
    });

    setOutput('time', new Date().toTimeString());
  } catch (error) {
    if (error instanceof Error) setFailed(error.message);
  }
}

run();
