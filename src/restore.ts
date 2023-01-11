import { setFailed, setOutput } from '@actions/core';
import { isValidEvent } from '@/lib/utils';
import { getInputs } from '@/lib/inputs';

async function run(): Promise<void> {
  try {
    // TODO: パターン未確認
    if (!isValidEvent()) return;
    const inputs = getInputs(process.argv);
    console.log({ inputs });

    // TODO: getCache
    // const state = utils.getCacheState();

    setOutput('time', new Date().toTimeString());
  } catch (error) {
    if (error instanceof Error) setFailed(error.message);
  }
}

run();
