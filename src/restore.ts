import { isValidEvent, isExactKeyMatch } from '@/lib/utils';
import { getInputs, getClientConfigByInputs } from '@/lib/inputs';
import { setCacheHitOutput, saveState, logInfo, logWarning, setFailed } from '@/lib/actions/core';
import { restoreCache, ValidationError } from '@/lib/actions/cache';
import { createGatewayClient } from '@/lib/proto';

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

    saveState('CACHE_KEY', inputs.key);

    const clientConfig = getClientConfigByInputs(inputs);
    try {
      // TODO: cacheKeyってなんだっけ
      const cacheKey = await restoreCache(gatewayClient, clientConfig);
      if (!cacheKey) {
        logInfo(`Cache not found for input keys: ${[inputs.key, ...(inputs.restoreKeys ?? [])].join(', ')}`);
        return;
      }

      saveState('CACHE_RESULT', cacheKey);
      setCacheHitOutput(isExactKeyMatch(inputs.key, cacheKey));
      logInfo(`Cache restored from key: ${cacheKey}`);
    } catch (e: unknown) {
      if (e instanceof Error) {
        if (e.name === ValidationError.name) {
          throw e;
        } else {
          logWarning(e.message);
          setCacheHitOutput(false);
        }
      }
    }
  } catch (error) {
    if (error instanceof Error) setFailed(error.message);
  }
}

run();
