// 不要な文字がなく、parseIntできたらtrue
export function isNumber(v: string): boolean {
  if (typeof v !== 'string') return false;
  if (/\+|:|-|\//g.test(v)) return false;

  return !Number.isNaN(parseInt(v, 10));
}
