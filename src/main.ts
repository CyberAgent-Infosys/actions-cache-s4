import { debug, getInput, setFailed, setOutput } from '@actions/core';
import { wait } from '@/wait';

async function run(): Promise<void> {
  try {
    const path: string = getInput('path');
    debug(`path: ${path}`); // debug is only output if you set the secret `ACTIONS_STEP_DEBUG` to true

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
