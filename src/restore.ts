import { execRestoreCache } from '@/lib/actions/cache';
import { isExactKeyMatch, isValidEvent } from '@/lib/actions/cacheUtils';
import { setCacheHitOutput, saveState, logInfo, logWarning, setFailed, logDebug } from '@/lib/actions/core';
import { ValidationError } from '@/lib/actions/error';
import { getInputs, getClientConfig } from '@/lib/inputs';
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

    const clientConfig = getClientConfig(inputs);

    logDebug(`githubRepository: ${clientConfig.githubRepository}`);
    logDebug(`githubUrl: ${clientConfig.githubUrl}`);
    logDebug(`key: ${clientConfig.key}`);

    try {
      const cacheKey = await execRestoreCache(gatewayClient, clientConfig);
      if (!cacheKey) {
        logInfo(`Cache not found for input keys: ${[inputs.key, ...(inputs.restoreKeys ?? [])].join(', ')}`);
        return;
      }

      saveState('CACHE_RESULT', cacheKey);
      setCacheHitOutput(isExactKeyMatch(inputs.key, cacheKey));
      logDebug(`Cache restored from key: ${cacheKey}`);
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
    if (error instanceof Error) {
      setFailed(error.message);
    } else {
      console.error(error);
    }
  }
}

run();
