import { info } from '@actions/core';
import { getEnv } from '@/lib/env';

export function logWarning(v: string): void {
  const prefix = '[warning]';
  info(`${prefix}${v}`);
}

export function isValidEvent(): boolean {
  // TODO: CLI実行だったらスルーさせたい
  const isDebug = getEnv('DEBUG_MODE') ?? false;
  if (isDebug) return true;

  const isValid = Boolean(getEnv('GITHUB_REF') ?? false);
  const eventName = getEnv('GITHUB_EVENT_NAME');

  if (!isValid) {
    logWarning(
      `Event Validation Error: The event type ${eventName}
      } is not supported because it's not tied to a branch or tag ref.`,
    );
  }

  return isValid;
}

export function isGhes(): boolean {
  const ghUrl = new URL(getEnv('GITHUB_SERVER_URL') ?? 'https://github.com');
  return ghUrl.hostname.toUpperCase() !== 'GITHUB.COM';
}
