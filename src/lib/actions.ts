import { InputName } from '@/@types/argv';
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

export function getInput(k: string, options?: InputOptions): string | undefined {
  const v = _getInput(k, options);
  return v !== '' ? v : undefined;
}

export function getInputAsInt(k: InputName, options?: InputOptions): number | undefined {
  const v = getInput(k, options);
  return typeof v === 'string' && isNumber(v) ? parseInt(v, 10) : undefined;
}

export function getInputAsBool(k: InputName, options?: InputOptions): boolean | undefined {
  const v = getInput(k, options);
  return strToBool(v);
}

export function getInputAsArray(k: InputName, options?: InputOptions): string[] | undefined {
  const v = getInput(k, options);
  return typeof v === 'string' ? strToArray(v ?? '') : undefined;
}

type STATE_KEY = 'CACHE_KEY' | 'CACHE_RESULT';
export function getState(k: STATE_KEY): string | undefined {
  const v = _getState(k);
  return v !== '' ? v : undefined;
}

export function getCacheState(): string | undefined {
  const cacheKey = getState('CACHE_KEY');
  if (cacheKey) {
    logDebug(`Cache state/key: ${cacheKey}`);
    return cacheKey;
  }

  return undefined;
}
