import * as cp from 'child_process';
import * as path from 'path';
import * as process from 'process';
import { describe, test } from '@jest/globals';

// shows how the runner will run a javascript action with env / stdout protocol
describe('test runs', () => {
  const np = process.execPath;
  const options: cp.ExecFileSyncOptions = { env: process.env };

  test('save.js', () => {
    const ip = path.join(__dirname, '../..', 'dist', 'save', 'index.js');
    console.log(cp.execFileSync(np, [ip], options).toString());
  });

  test('restore.js', () => {
    const ip = path.join(__dirname, '../..', 'dist', 'restore', 'index.js');
    console.log(cp.execFileSync(np, [ip], options).toString());
  });
});
