import { setFailed } from '@actions/core';
import { isValidEvent, isExactKeyMatch } from '@/lib/utils';
import { getInputs, getS3ClientConfigByInputs } from '@/lib/inputs';
import { setCacheHitOutput, saveState, logInfo, logWarning } from '@/lib/actions/core';
import { restoreCache, ValidationError } from '@/lib/actions/cache';

export async function run(): Promise<void> {
  try {
    if (!isValidEvent()) return;

    const inputs = getInputs(process.argv);
    if (!inputs.path || !inputs.key || !inputs.awsS3Bucket || !inputs.awsAccessKeyId || !inputs.awsSecretAccessKey) {
      logInfo('Please input required key.');
      return;
    }
    const s3ClientConfig = getS3ClientConfigByInputs(inputs);

    saveState('CACHE_KEY', inputs.key);

    try {
      const cacheKey = await restoreCache(
        inputs.path,
        inputs.key,
        inputs.restoreKeys,
        s3ClientConfig,
        inputs.awsS3Bucket,
      );

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
