import * as cp from 'child_process';
import * as path from 'path';
import * as process from 'process';
import { describe, test, beforeEach, afterEach } from '@jest/globals';

beforeEach(() => {
  process.env['GITHUB_EVENT_NAME'] = 'push';
  process.env['GITHUB_REF'] = 'refs/heads/feature-branch';
});

afterEach(() => {
  delete process.env['GITHUB_EVENT_NAME'];
  delete process.env['GITHUB_REF'];
});

// shows how the runner will run a javascript action with env / stdout protocol
describe('test runs', () => {
  const np = process.execPath;
  const options: cp.ExecFileSyncOptions = { env: process.env };
  const argv: string[] = [
    '--path=node_modules',
    '--key=XXXX',
    '--aws-s3-bucket=XXXX',
    '--aws-access-key-id=XXXX',
    '--aws-secret-access-key=XXXX',
  ];

  // TODO: 迂回処理が必要
  test('save.js', () => {
    const ip = path.join(__dirname, '../..', 'dist', 'save', 'index.js');
    console.log(cp.execFileSync(np, [ip, ...argv], options).toString());
  });

  test('restore.js', () => {
    const ip = path.join(__dirname, '../..', 'dist', 'restore', 'index.js');
    console.log(cp.execFileSync(np, [ip, ...argv], options).toString());
  });
});
