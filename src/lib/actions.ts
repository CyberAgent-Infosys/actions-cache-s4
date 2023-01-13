import { InputKey } from '@/@types/input';
import { strToBool } from '@/lib/strToBool';
import { info, debug, getInput as _getInput, getState as _getState, InputOptions } from '@actions/core';
import { isNumber } from '@/lib/isNumber';
import { strToArray } from './strToArray';

export function logInfo(v: string): void {
  info(v);
}

export function logWarning(v: string): void {
  const prefix = '[warning]';
  info(`${prefix}${v}`);
}

export function logDebug(v: string): void {
  debug(v);
}

export function getInput(k: InputKey, options?: InputOptions): string | undefined {
  const v = _getInput(k, options);
  return v !== '' ? v : undefined;
}

export function getInputAsInt(k: InputKey, options?: InputOptions): number | undefined {
  const v = getInput(k, options);
  return typeof v === 'string' && isNumber(v) ? parseInt(v, 10) : undefined;
}

export function getInputAsBool(k: InputKey, options?: InputOptions): boolean | undefined {
  const v = getInput(k, options);
  return strToBool(v);
}

export function getInputAsArray(k: InputKey, options?: InputOptions): string[] | undefined {
  const v = getInput(k, options);
  return typeof v === 'string' ? strToArray(v ?? '') : undefined;
}

type STATE_KEY = 'CACHE_KEY' | 'CACHE_RESULT';

export function getState(k: STATE_KEY): string {
  const v = _getState(k);
  return v;
}

export function getCacheState(): string {
  const cacheKey = getState('CACHE_RESULT');
  if (cacheKey) logDebug(`Cache state/key: ${cacheKey}`);
  return cacheKey;
}
