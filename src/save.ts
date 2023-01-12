import { setFailed, setOutput } from '@actions/core';
import { getCacheState, getState } from '@/lib/actions';
import { isValidEvent } from '@/lib/utils';
import { getInputs } from '@/lib/inputs';

async function run(): Promise<void> {
  console.log('called save proc.');

  try {
    // TODO: パターン未確認
    if (!isValidEvent()) return;

    const inputs = getInputs(process.argv);
    console.log({ inputs });

    // TODO: getCache
    const state = getCacheState();
    const primaryKey = getState('CACHE_KEY');
    console.log({ state, primaryKey });

    setOutput('time', new Date().toTimeString());
  } catch (error) {
    if (error instanceof Error) setFailed(error.message);
  }
}

run();
