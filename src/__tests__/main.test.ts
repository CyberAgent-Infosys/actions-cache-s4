import * as cp from 'child_process';
import * as path from 'path';
import * as process from 'process';
import { describe, test } from '@jest/globals';

// shows how the runner will run a javascript action with env / stdout protocol
describe('test runs', () => {
  const np = process.execPath;
  const options: cp.ExecFileSyncOptions = { env: process.env };
  const argv = [
    '--path=node_modules',
    '--key=XXXX',
    '--aws-s3-bucket=XXXX',
    '--aws-access-key-id=XXXX',
    '--aws-secret-access-key=XXXX',
    '--aws-s3-bucket-endpoint=true',
    '--aws-s3-force-path-style=true',
  ];

  test('save.js', () => {
    const ip = path.join(__dirname, '../..', 'dist', 'save', 'index.js');
    console.log(cp.execFileSync(np, [ip, ...argv], options).toString());
  });

  test('restore.js', () => {
    const ip = path.join(__dirname, '../..', 'dist', 'restore', 'index.js');
    console.log(cp.execFileSync(np, [ip, ...argv], options).toString());
  });
});
