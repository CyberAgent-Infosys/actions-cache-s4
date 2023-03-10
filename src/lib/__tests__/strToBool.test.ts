import { describe, expect, test } from '@jest/globals';
import { strToBool } from '@/lib/strToBool';

describe('strToBool', () => {
  test('文字列trueがbooleanのtrueに変換できる', () => {
    expect(strToBool('true')).toEqual(true);
  });

  test('文字列falseがbooleanのfalseに変換できる', () => {
    expect(strToBool('false')).toEqual(false);
  });
});
