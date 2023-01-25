import {
  getBooleanInput as _getBooleanInput,
  info,
  debug,
  getInput as _getInput,
  getState as _getState,
  saveState as _saveState,
  setOutput as _setOutput,
  InputOptions,
} from '@actions/core';
import { InputParamsKey } from '@/@types/input';
import { StateKey, OutputKey } from '@/@types/action';
import { isNumber } from '@/lib/isNumber';
import { strToArray } from '@/lib/strToArray';

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

export function getInput(k: InputParamsKey, options?: InputOptions): string | undefined {
  const v = _getInput(k, options);
  return v !== '' ? v : undefined;
}

export function getInputAsInt(k: InputParamsKey, options?: InputOptions): number | undefined {
  const v = getInput(k, options);
  return typeof v === 'string' && isNumber(v) ? parseInt(v, 10) : undefined;
}

export function getBooleanInput(k: InputParamsKey, options?: InputOptions): boolean | undefined {
  try {
    return _getBooleanInput(k, options);
  } catch (error) {
    return undefined;
  }
}

export function getInputAsArray(k: InputParamsKey, options?: InputOptions): string[] | undefined {
  const v = getInput(k, options);
  return typeof v === 'string' ? strToArray(v ?? '') : undefined;
}

export function getState(k: StateKey): string {
  const v = _getState(k);
  return v;
}

export function saveState(k: StateKey, v: string): void {
  _saveState(k, v);
}

export function setOutput(k: OutputKey, v: string): void {
  _setOutput(k, v);
}
export function setCacheHitOutput(isCacheHit: boolean): void {
  setOutput('cache-hit', isCacheHit.toString());
}
