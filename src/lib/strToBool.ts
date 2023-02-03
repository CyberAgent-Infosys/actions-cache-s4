export function strToBool(v: string | undefined): boolean | undefined {
  if (typeof v !== 'string') return undefined;
  return v === 'true';
}
