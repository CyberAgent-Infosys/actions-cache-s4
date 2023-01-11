export function strToBool(v: string | unknown): boolean | undefined {
  if (typeof v !== 'string') return undefined;
  return v === 'true';
}
