import { InputName } from '@/@types/argv';
import { strToBool } from '@/lib/strToBool';
import { debug, getInput as _getInput, getState as _getState, InputOptions } from '@actions/core';
import { isNumber } from '@/lib/isNumber';

export function getInput(k: string, options?: InputOptions): string | unknown {
  const v = _getInput(k, options);
  return v !== '' ? v : undefined;
}

export function getInputAsInt(k: InputName, options?: InputOptions): number | unknown {
  const v = getInput(k, options);
  return typeof v === 'string' && isNumber(v) ? parseInt(v, 10) : undefined;
}

export function getInputAsBool(k: InputName, options?: InputOptions): boolean | unknown {
  const v = getInput(k, options);
  return strToBool(v);
}

type STATE_KEY = 'CACHE_KEY' | 'CACHE_RESULT';
export function getState(k: STATE_KEY): string {
  return _getState(k);
}

export function getCacheState(): string | undefined {
  const cacheKey = getState('CACHE_KEY');
  if (cacheKey) {
    debug(`Cache state/key: ${cacheKey}`);
    return cacheKey;
  }

  return undefined;
}
