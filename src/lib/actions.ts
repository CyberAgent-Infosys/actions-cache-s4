import { InputName } from '@/@types/argv';
import { strToBool } from '@/lib/strToBool';
import { getInput as _getInput, InputOptions } from '@actions/core';
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
