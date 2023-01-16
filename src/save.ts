import { ValidationError, ReserveCacheError } from '@actions/cache';
import { setFailed, setOutput } from '@actions/core';
import { getCacheState, getCacheKey, saveCache, logInfo, logWarning } from '@/lib/actions';
import { isExactKeyMatch, isValidEvent } from '@/lib/utils';
import { getInputs, getS3ClientConfigByInputs } from '@/lib/inputs';

async function run(): Promise<void> {
  console.log('called save proc.');

  try {
    // TODO: パターン未確認
    if (!isValidEvent()) return;

    const inputs = getInputs(process.argv);
    if (!inputs.path) return;

    // キャッシュの検証
    const state = getCacheState();

    // TODO: stateからキーをとってくる理由を調べる
    const primaryKey = getCacheKey(inputs?.key);

    // Inputs are re-evaluted before the post action, so we want the original key used for restore
    if (!primaryKey) {
      logWarning('Error retrieving key from state.');
      return;
    }

    // TODO: delete me
    console.log({ inputs });

    if (isExactKeyMatch(primaryKey, state)) {
      logInfo(`Cache hit occurred on the primary key ${primaryKey}, not saving cache.`);
      return;
    }

    const s3config = getS3ClientConfigByInputs(inputs);
    if (typeof s3config === 'undefined') {
      logInfo('Please setup S3 config.');
      return;
    }

    try {
      await saveCache(
        inputs.path,
        primaryKey,
        {
          uploadChunkSize: inputs.uploadChunkSize,
        },
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
