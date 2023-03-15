import { Inputs } from '@/@types/input';
import { GatewayClientConfig } from '@/@types/proto';
import { DefaultUploadChunkSize } from '@/lib/actions/constants';
import { getInput, getInputAsInt, getInputAsArray } from '@/lib/actions/core';
import { getArgv } from '@/lib/argv';
import { getEnv } from '@/lib/env';

export function getInputs(argv: string[]): Inputs {
  const inputArgv = getArgv(argv);
  const requiredOption = { required: true };

  // CLIからだと引数、Github Actions経由ではgetInputからパラメータを用意
  const path = inputArgv.path ?? getInputAsArray('path', requiredOption);
  const key = inputArgv.key ?? getInput('key', requiredOption);
  const restoreKeys = inputArgv.restoreKeys ?? getInputAsArray('restore-keys');
  const uploadChunkSize = inputArgv.uploadChunkSize ?? getInputAsInt('upload-chunk-size') ?? defaultUploadChunkSize;

  return {
    path,
    key,
    restoreKeys,
    uploadChunkSize,
  };
}

export function getClientConfigByInputs(inputs: Inputs): GatewayClientConfig {
  return {
    paths: inputs.path,
    key: inputs.key,
    restoreKeys: inputs.restoreKeys,
    githubUrl: getEnv('GITHUB_ACTION_SERVER_URL'),
    githubRepository: getEnv('GITHUB_ACTION_REPOSITORY'),
    uploadChunkSize: inputs.uploadChunkSize,
  } as GatewayClientConfig;
}
