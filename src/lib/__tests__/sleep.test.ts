import { expect, test } from '@jest/globals';
import { sleep } from '@/lib/sleep';

test('sleep 500 ms', async () => {
  const start = new Date();
  await sleep(500);
  const end = new Date();
  const delta = Math.abs(end.getTime() - start.getTime());
  expect(delta).toBeGreaterThan(450);
});
