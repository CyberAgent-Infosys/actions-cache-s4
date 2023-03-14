import { getEnv } from '@/lib/env';
import { logWarning } from '@/lib/actions/core';
import { strToBool } from '@/lib/strToBool';

export const isDebug = strToBool(getEnv('DEBUG_MODE')) ?? false;
export const isAnnoy = isDebug && (strToBool(getEnv('IS_ANNOY')) ?? false);
export const nodeEnv = getEnv('NODE_ENV');

export function isValidEvent(): boolean {
  // jest経由の実行だったら落とす
  if (nodeEnv === 'test') return false;

  // CLI実行だったらスキップ
  if (isDebug) return true;

  const isValid = Boolean(getEnv('GITHUB_REF') ?? false);
  const eventName = getEnv('GITHUB_EVENT_NAME') ?? 'undefined';

  if (!isValid) {
    logWarning(
      `Event Validation Error: The event type ${eventName} is not supported because it's not tied to a branch or tag ref.`,
    );
  }

  return isValid;
}

export function isExactKeyMatch(key: string, cacheKey?: string): boolean {
  return !!(
    cacheKey &&
    cacheKey.localeCompare(key, undefined, {
      sensitivity: 'accent',
    }) === 0
  );
}
