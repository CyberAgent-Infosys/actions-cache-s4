import { setFailed, setOutput } from '@actions/core';
import { parseArgv } from '@/lib/parseArgv';
import { getInput } from '@/lib/actions';

async function run(): Promise<void> {
  try {
    const inputArgv = parseArgv(process.argv);
    console.log({ inputArgv });

    // TODO: 初期化
    const path = inputArgv.path ?? getInput('path');
    const key = inputArgv.key ?? getInput('key');
    const restoreKeys = inputArgv['restore-keys'] ?? getInput('restore-keys');
    const uploadChunkSize = inputArgv['upload-chunk-size'] ?? getInput('upload-chunk-size');
    const s3BucketEndpoint = inputArgv['aws-s3-bucket-endpoint'] ?? getInput('aws-s3-bucket-endpoint') ?? true;
    const s3ForcePathStyle = inputArgv['aws-s3-force-path-style'] ?? getInput('aws-s3-force-path-style') ?? false;

    console.log({ path, key, restoreKeys, uploadChunkSize, s3BucketEndpoint, s3ForcePathStyle });

    setOutput('time', new Date().toTimeString());
  } catch (error) {
    if (error instanceof Error) setFailed(error.message);
  }
}

run();
