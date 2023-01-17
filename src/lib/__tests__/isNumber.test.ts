import { describe, expect, test } from '@jest/globals';
import { isNumber } from '@/lib/isNumber';

describe('isNumber', () => {
  test('文字列として数字を受け取るとtrueを返す', () => {
    expect(isNumber('1234')).toEqual(true);
  });

  test('文字列として文字を受け取るとfalseを返す', () => {
    expect(isNumber('aaaa')).toEqual(false);
  });
});
