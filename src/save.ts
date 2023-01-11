import { setFailed, setOutput } from '@actions/core';
import { getInputs, Inputs } from '@/lib/inputs';

async function run(): Promise<void> {
  try {
    const inputs: Inputs = getInputs(process?.argv);
    console.log({ inputs });

    setOutput('time', new Date().toTimeString());
  } catch (error) {
    if (error instanceof Error) setFailed(error.message);
  }
}

run();
