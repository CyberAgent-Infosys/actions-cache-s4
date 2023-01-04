import { getInput as _getInput } from '@actions/core';

export const getInput = (k: string): string | null => {
  const v = _getInput(k);
  return v === '' ? null : v;
};
