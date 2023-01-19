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
import { S3ClientConfig } from '@aws-sdk/client-s3';
import { InputParamsKey } from '@/@types/input';
import { StateKey, OutputKey } from '@/@types/action';
import { saveCache as _saveCache, restoreCache as _restoreCache } from '@actions/cache';
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

export async function saveCache(
  paths: string[],
  primaryKey: string,
  options: UploadOptions,
  s3ClientConfig?: S3ClientConfig,
  s3BucketName?: string | undefined,
): Promise<number | void> {
  if (isDebug) {
    logDebug('Skip save process.');
    return;
  }

  logInfo(`Cache saved with key: ${primaryKey}`);
  return _saveCache(paths, primaryKey, options, s3ClientConfig, s3BucketName);
}

export async function restoreCache(
  path: string[],
  primaryKey: string,
  restoreKeys: string[] | undefined,
  options: object | undefined,
  s3ClientConfig?: S3ClientConfig,
  s3BucketName?: string | undefined,
): Promise<string | void> {
  if (isDebug) {
    logDebug('Skip restore cache process.');
    return;
  }

  return _restoreCache(path, primaryKey, restoreKeys, options, s3ClientConfig, s3BucketName);
}

export function setOutput(k: OutputKey, v: string): void {
  _setOutput(k, v);
}
export function setCacheHitOutput(isCacheHit: boolean): void {
  setOutput('cache-hit', isCacheHit.toString());
}
