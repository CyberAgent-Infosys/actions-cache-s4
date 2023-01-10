import { describe, expect, test } from '@jest/globals';
import { getInput } from '@/lib/actions';

describe('getInput', () => {
  test('github actions以外の環境で実行するとnullが返る', () => {
    expect(getInput('hoge')).toEqual(null);
  });

  test('github actions以外の環境で実行すると第二引数の初期値が返る', () => {
    const defaultValue = '';
    expect(getInput('hoge', defaultValue)).toEqual(defaultValue);
  });
});
