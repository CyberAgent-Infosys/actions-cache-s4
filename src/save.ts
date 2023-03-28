import { execSaveCache } from '@/lib/actions/cache';
import { isExactKeyMatch, isValidEvent } from '@/lib/actions/cacheUtils';
import { getState, logInfo, logWarning, setFailed } from '@/lib/actions/core';
import { ValidationError, ReserveCacheError } from '@/lib/actions/error';
import { getInputs, getClientConfigByInputs } from '@/lib/inputs';
import { createGatewayClient } from '@/lib/proto';
import { isDebug } from '@/lib/utils';

export async function run(): Promise<void> {
  try {
    if (!isValidEvent()) return;

    const inputs = getInputs(process.argv);
    if (!inputs.path || !inputs.key) {
      logInfo('Please input required key.');
      return;
    }
    const gatewayClient = createGatewayClient();
    if (!gatewayClient) {
      logInfo('failed to init gatewayClient.');
      return;
    }

    // キャッシュの検証
    const state = getState('CACHE_RESULT');

    // デバッグの時はgetStateを迂回
    const primaryKey = isDebug ? inputs.key : getState('CACHE_KEY');

    // Inputs are re-evaluted before the post action, so we want the original key used for restore
    if (!primaryKey) {
      logWarning('Error retrieving key from state.');
      return;
    }

    if (isExactKeyMatch(primaryKey, state)) {
      logInfo(`Cache hit occurred on the primary key ${primaryKey}, not saving cache.`);
      return;
    }
    const clientConfig = getClientConfigByInputs(inputs);
    try {
      await execSaveCache(gatewayClient, clientConfig);
      logInfo(`Cache saved with key: ${primaryKey}`);
    } catch (e: unknown) {
      if (e instanceof Error) {
        if (e.name === ValidationError.name) {
          throw e;
        } else if (e.name === ReserveCacheError.name) {
          logInfo(e.message);
        } else {
          throw e;
        }
      }
    }
  } catch (error) {
    if (error instanceof Error) {
      setFailed(error.message);
    } else {
      console.error(error);
    }
  }
}

run();
