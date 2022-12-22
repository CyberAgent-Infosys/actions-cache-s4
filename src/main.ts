import { debug, getInput, setFailed, setOutput } from '@actions/core';
import { wait } from '@/wait';
import { parseArgv } from '@/lib/parseArgv';

async function run(): Promise<void> {
  try {
    const option = parseArgv(process.argv);
    console.log({ option });

    const path = option?.path ?? getInput('path');
    console.log({ path });

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
