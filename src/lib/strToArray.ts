export function strToArray(v: string): string[] {
  return v
    .replace('\\n', '\n')
    .split('\n')
    .map((s: string) => s.trim())
    .filter((x: string) => x !== '');
}
