import { expect, test } from '@jest/globals';
import { wait } from '@/lib/wait';

test('throws invalid number', async () => {
  const input = parseInt('foo', 10);
  await expect(wait({ milliseconds: input })).rejects.toThrow('milliseconds not a number');
});

test('wait 500 ms', async () => {
  const start = new Date();
  await wait({ milliseconds: 500 });
  const end = new Date();
  const delta = Math.abs(end.getTime() - start.getTime());
  expect(delta).toBeGreaterThan(450);
});
