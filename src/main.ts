import { debug, getInput, setFailed, setOutput } from '@actions/core';
import { wait } from '@/wait';
import { parseArgv } from '@/lib/parseArgv';

async function run(): Promise<void> {
  try {
    const inputArgv = parseArgv(process.argv);
    console.log({ inputArgv });

    const path = inputArgv?.path ?? getInput('path');
    const key = inputArgv?.key ?? getInput('key');
    const restoreKeys = inputArgv?.['restore-keys'] ?? getInput('restore-keys');
    const uploadChunkSize = inputArgv?.['upload-chunk-size'] ?? getInput('upload-chunk-size');
    console.log({ path, key, restoreKeys, uploadChunkSize });

    debug(new Date().toTimeString());

    const ms = 1000;
    await wait({ milliseconds: ms });
    debug(new Date().toTimeString());

    setOutput('time', new Date().toTimeString());
  } catch (error) {
    if (error instanceof Error) setFailed(error.message);
  }
}

run();
