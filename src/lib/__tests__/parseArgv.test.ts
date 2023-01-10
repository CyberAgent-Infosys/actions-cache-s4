import { describe, expect, test } from '@jest/globals';
import { parseArgv } from '@/lib/parseArgv';

const input = [
  '/bin/node',
  'src/save.ts',
  '--path=./node_modules\\n./package-lock.json',
  '--key=LINUX-nodejs-ABRACADABRA',
  '--restore-keys=LINUX-nodejs-\\nLINUX-',
  '--aws-s3-bucket=mybucket',
  '--aws-access-key-id=ABRACADABRA',
  '--aws-secret-access-key=ABRACADABRA',
  '--aws-region=ap-xxxxxxxxx-1',
  '--aws-endpoint=example.com',
  '--aws-s3-bucket-endpoint=false',
  '--aws-s3-force-path-style=true',
  '--upload-chunk-size=9999',
];

describe('parseArgv', () => {
  test('inputを配列で受け取り、パースしてオブジェクト返す', () => {
    expect(parseArgv(input)).toEqual({
      'aws-access-key-id': 'ABRACADABRA',
      'aws-endpoint': 'example.com',
      'aws-region': 'ap-xxxxxxxxx-1',
      'aws-s3-bucket': 'mybucket',
      'aws-s3-bucket-endpoint': false,
      'aws-s3-force-path-style': true,
      'aws-secret-access-key': 'ABRACADABRA',
      key: 'LINUX-nodejs-ABRACADABRA',
      path: './node_modules\\n./package-lock.json',
      'restore-keys': 'LINUX-nodejs-\\nLINUX-',
      'upload-chunk-size': 9999,
    });
  });
});
