import { ValidationError, ReserveCacheError } from '@actions/cache';
import { setFailed, setOutput } from '@actions/core';
import { getState, saveCache, logInfo, logWarning } from '@/lib/actions';
import { isExactKeyMatch, isValidEvent, isDebug } from '@/lib/utils';
import { getInputs, getS3ClientConfigByInputs } from '@/lib/inputs';

async function run(): Promise<void> {
  try {
    if (!isValidEvent()) return;

    const inputs = getInputs(process.argv);
    if (!inputs.path || !inputs.key || !inputs.awsS3Bucket || !inputs.awsAccessKeyId || !inputs.awsSecretAccessKey) {
      logInfo('Please input required key.');
      return;
    }

    const s3config = getS3ClientConfigByInputs(inputs);
    if (typeof s3config === 'undefined') {
      logInfo('Please setup S3 config.');
      return;
    }

    // キャッシュの検証
    const state = getState('CACHE_RESULT');
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

    try {
      await saveCache(
        inputs.path,
        primaryKey,
        { uploadChunkSize: inputs.uploadChunkSize },
        s3config,
        inputs.awsS3Bucket,
      );
      logInfo(`Cache saved with key: ${primaryKey}`);
    } catch (e: unknown) {
      if (e instanceof Error) {
        if (e.name === ValidationError.name) {
          throw e;
        } else if (e.name === ReserveCacheError.name) {
          logInfo(e.message);
        } else {
          logWarning(e.message);
        }
      }
      throw e;
    }
    setOutput('time', new Date().toTimeString());
  } catch (error) {
    if (error instanceof Error) setFailed(error.message);
  }
}

run();
