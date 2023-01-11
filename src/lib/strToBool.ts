export function strToBool(v: string | unknown): boolean {
  if (typeof v !== 'string') throw new Error('detected invalid value.');
  return v === 'true';
};
