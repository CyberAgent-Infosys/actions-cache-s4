import { describe, expect, test } from '@jest/globals';
import { getInput } from '@/lib/actions';

describe('getInput', () => {
  test('github actions以外の環境で実行するとundefinedが返る', () => {
    const options = {};
    expect(getInput('hoge', options)).toBeUndefined();
  });
});
