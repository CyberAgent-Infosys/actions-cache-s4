import { describe, expect, test } from '@jest/globals';
import { parseArgv, getArgv } from '@/lib/argv';

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
      'aws-s3-bucket-endpoint': 'false',
      'aws-s3-force-path-style': 'true',
      'aws-secret-access-key': 'ABRACADABRA',
      key: 'LINUX-nodejs-ABRACADABRA',
      path: './node_modules\\n./package-lock.json',
      'restore-keys': 'LINUX-nodejs-\\nLINUX-',
      'upload-chunk-size': '9999',
    });
  });

  test('parseArgvの値を受け取り、型変換されたオブジェクト返す', () => {
    expect(getArgv(input)).toEqual({
      awsAccessKeyId: 'ABRACADABRA',
      awsEndpoint: 'example.com',
      awsRegion: 'ap-xxxxxxxxx-1',
      awsS3Bucket: 'mybucket',
      awsS3BucketEndpoint: false,
      awsS3ForcePathStyle: true,
      awsSecretAccessKey: 'ABRACADABRA',
      key: 'LINUX-nodejs-ABRACADABRA',
      path: ['./node_modules', './package-lock.json'],
      restoreKeys: 'LINUX-nodejs-\\nLINUX-',
      uploadChunkSize: 9999,
    });
  });
});
