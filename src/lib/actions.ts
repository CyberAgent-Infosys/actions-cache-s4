import { InputName, InputValue } from '@/@types/argv';
import { strToBool } from '@/lib/strToBool';
import { getInput as _getInput } from '@actions/core';

export const getInput = (k: string, initialValue: unknown = null): string | unknown => {
  const v = _getInput(k);
  return v === '' ? initialValue : v;
};

export const customGetInput = (k: InputName): InputValue | unknown => {
  const v = getInput(k);
  if (v === null) return null;

  if ((['upload-chunk-size'] as InputName[]).includes(k)) return Number(v);
  if (['aws-s3-bucket-endpoint', 'aws-s3-force-path-style'].includes(k)) return strToBool(v);
  return v;
};
