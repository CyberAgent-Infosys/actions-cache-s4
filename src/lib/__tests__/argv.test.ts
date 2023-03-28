import { describe, expect, test } from '@jest/globals';
import { parseArgv, getArgv } from '@/lib/argv';

const input = [
  '/bin/node',
  'src/save.ts',
  '--path=./node_modules\\n./package-lock.json',
  '--key=LINUX-nodejs-ABRACADABRA',
  '--restore-keys=LINUX-nodejs-\\nLINUX-',
  '--upload-chunk-size=9999',
];

describe('parseArgv', () => {
  test('inputを配列で受け取り、パースしてオブジェクト返す', () => {
    expect(parseArgv(input)).toEqual({
      key: 'LINUX-nodejs-ABRACADABRA',
      path: './node_modules\\n./package-lock.json',
      'restore-keys': 'LINUX-nodejs-\\nLINUX-',
      'upload-chunk-size': '9999',
    });
  });

  test('parseArgvの値を受け取り、型変換されたオブジェクト返す', () => {
    expect(getArgv(input)).toEqual({
      key: 'LINUX-nodejs-ABRACADABRA',
      path: ['./node_modules', './package-lock.json'],
      restoreKeys: ['LINUX-nodejs-', 'LINUX-'],
      uploadChunkSize: 9999,
    });
  });
});
