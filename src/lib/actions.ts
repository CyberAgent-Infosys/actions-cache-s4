import { S3ClientConfig } from '@aws-sdk/client-s3';
import { InputParamsKey } from '@/@types/input';
import { StateKey, OutputKey } from '@/@types/action';
import { strToBool } from '@/lib/strToBool';
import {
  info,
  debug,
  getInput as _getInput,
  getState as _getState,
  saveState as _saveState,
  setOutput as _setOutput,
  InputOptions,
} from '@actions/core';
import { saveCache as _saveCache } from '@actions/cache';
import { isNumber } from '@/lib/isNumber';
import { isDebug } from '@/lib/utils';
import { strToArray } from '@/lib/strToArray';
import { UploadOptions } from '@actions/cache/lib/options';

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

export function getInputAsBool(k: InputParamsKey, options?: InputOptions): boolean | undefined {
  const v = getInput(k, options);
  return strToBool(v);
}

export function getInputAsArray(k: InputParamsKey, options?: InputOptions): string[] | undefined {
  const v = getInput(k, options);
  return typeof v === 'string' ? strToArray(v ?? '') : undefined;
}

export function getState(k: StateKey): string {
  const v = _getState(k);
  return v;
}

export function getCacheKey(key: string | undefined): string | undefined {
  const cacheKey = isDebug ? key : getState('CACHE_KEY');
  if (cacheKey) logDebug(`Cache key: ${cacheKey}`);
  return cacheKey;
}

export function getCacheState(): string {
  const cacheKey = getState('CACHE_RESULT');
  if (cacheKey) logDebug(`Cache state: ${cacheKey}`);
  return cacheKey;
}

export function saveState(k: StateKey, v: string): void {
  _saveState(k, v);
}

export function saveCacheKey(v: string): void {
  saveState('CACHE_KEY', v);
}

export function saveCacheState(v: string): void {
  saveState('CACHE_RESULT', v);
}

export async function saveCache(
  paths: string[],
  primaryKey: string,
  options: UploadOptions,
  s3Options: S3ClientConfig,
  s3BucketName: string | undefined,
): Promise<number | void> {
  if (isDebug) {
    logDebug('Skip save process.');
    return;
  }

  logInfo(`Cache saved with key: ${primaryKey}`);
  return _saveCache(paths, primaryKey, options, s3Options, s3BucketName);
}

export function setOutput(k: OutputKey, v: string): void {
  _setOutput(k, v);
}
export function setCacheHitOutput(isCacheHit: boolean): void {
  setOutput('cache-hit', isCacheHit.toString());
}
