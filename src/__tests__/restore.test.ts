import * as process from 'process';
import { describe, test, expect, jest, beforeEach, afterEach } from '@jest/globals';
import * as utils from '@/lib/utils';
import * as cacheUtils from '@/lib/actions/cacheUtils';
import * as actions from '@/lib/actions/core';
import * as cache from '@/lib/actions/cache';
import * as inputs from '@/lib/inputs';
import { run } from '@/restore';

jest.mock('@/lib/utils');
jest.mock('@/lib/actions/core');

beforeEach(() => {
  process.env['GITHUB_EVENT_NAME'] = 'push';
  process.env['GITHUB_REF'] = 'refs/heads/feature-branch';
  process.env['DEBUG_MODE'] = 'true';

  jest.spyOn(utils, 'isValidEvent').mockImplementation(() => true);
  jest.spyOn(cacheUtils, 'isGhes').mockImplementation(() => false);
  jest.spyOn(utils, 'isExactKeyMatch').mockImplementation(() => false);
  jest.spyOn(actions, 'getInput').mockImplementation(() => 'XXX');
  jest.spyOn(actions, 'getInputAsInt').mockImplementation(() => 9999);
  jest.spyOn(actions, 'getBooleanInput').mockImplementation(() => true);
  jest.spyOn(actions, 'getInputAsArray').mockImplementation(() => ['XXX']);
  jest.spyOn(actions, 'setCacheHitOutput');
  jest.spyOn(cache, 'restoreCache').mockImplementation(async () => '');
  jest.spyOn(inputs, 'getInputs').mockImplementation(() => ({
    awsAccessKeyId: 'ABRACADABRA',
    awsEndpoint: 'example.com',
    awsRegion: 'ap-xxxxxxxxx-1',
    awsS3Bucket: 'mybucket',
    awsS3BucketEndpoint: false,
    awsS3ForcePathStyle: true,
    awsSecretAccessKey: 'ABRACADABRA',
    key: 'LINUX-nodejs-ABRACADABRA',
    path: ['./node_modules', './package-lock.json'],
    restoreKeys: ['LINUX-nodejs-', 'LINUX-'],
    uploadChunkSize: 9999,
  }));
});

afterEach(() => {
  delete process.env['GITHUB_EVENT_NAME'];
  delete process.env['GITHUB_REF'];
  delete process.env['DEBUG_MODE'];
});

describe('test runs', () => {
  test('restore.js', async () => {
    const getStateMock = jest.spyOn(actions, 'getState').mockImplementation(() => 'XXX');
    const saveStateMock = jest.spyOn(actions, 'saveState');
    const logInfoMock = jest.spyOn(actions, 'logInfo').mockImplementation(v => console.log('[logInfo]', v));
    const logWarningMock = jest.spyOn(actions, 'logWarning').mockImplementation(v => console.log('[logWarning]', v));

    await run();

    expect(getStateMock).toHaveBeenCalledTimes(0);
    expect(saveStateMock).toHaveBeenCalled();
    expect(logInfoMock).toHaveBeenCalled();
    expect(logWarningMock).toHaveBeenCalledTimes(0);
  });
});
