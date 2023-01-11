import { describe, expect, test } from '@jest/globals';
import { strToArray } from '@/lib/strToArray';

describe('strToArray', () => {
  test('改行区切りの文字列から配列を返す', () => {
    expect(strToArray('./node_modules\n./package-lock.json')).toEqual(['./node_modules', './package-lock.json']);
  });

  test('改行区切りの文字列から配列を返す', () => {
    expect(strToArray('./node_modules\n\n./package-lock.json')).toEqual(['./node_modules', './package-lock.json']);
  });
});
