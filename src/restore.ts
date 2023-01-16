import * as cache from '@actions/cache';
import { ValidationError } from '@actions/cache';
import { setFailed, setOutput } from '@actions/core';
import { isValidEvent, isExactKeyMatch } from '@/lib/utils';
import { getInputs, getS3ClientConfigByInputs } from '@/lib/inputs';
import { setCacheHitOutput, saveCacheKey, saveCacheState, logInfo, logWarning } from '@/lib/actions';

async function run(): Promise<void> {
  logInfo('called restore proc.');

  try {
    // TODO: パターン未確認
    if (!isValidEvent()) return;

    const inputs = getInputs(process.argv);
    if (!inputs.path || !inputs.key) {
      logInfo('Please input required key.');
      return;
    }

    const s3config = getS3ClientConfigByInputs(inputs);
    if (typeof s3config === 'undefined') {
      logInfo('Please setup S3 config.');
      return;
    }

    saveCacheKey(inputs.key);

    try {
      // TODO: 確認
      const cacheKey = await cache.restoreCache(
        inputs.path,
        inputs.key,
        inputs.restoreKeys,
        undefined,
        s3config,
        inputs.awsS3Bucket,
      );

      if (!cacheKey) {
        logInfo(`Cache not found for input keys: ${[inputs.key, ...(inputs.restoreKeys ?? [])].join(', ')}`);
        return;
      }

      saveCacheState(cacheKey);

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

    setOutput('time', new Date().toTimeString());
  } catch (error) {
    if (error instanceof Error) setFailed(error.message);
  }
}

run();
