import * as process from 'process';
import { describe, test, expect, jest, beforeEach, afterEach } from '@jest/globals';
import * as utils from '@/lib/utils';
import * as actions from '@/lib/actions';
import { run } from '@/save';

jest.mock('@actions/core');
jest.mock('@actions/cache');
jest.mock('@/lib/utils');
jest.mock('@/lib/actions');

beforeEach(() => {
  process.env['GITHUB_EVENT_NAME'] = 'push';
  process.env['GITHUB_REF'] = 'refs/heads/feature-branch';
  jest.spyOn(utils, 'isValidEvent').mockImplementation(() => true);
  jest.spyOn(utils, 'isGhes').mockImplementation(() => false);
  jest.spyOn(actions, 'getInput').mockImplementation(() => 'XXX');
  jest.spyOn(actions, 'getInputAsInt').mockImplementation(() => 9999);
  jest.spyOn(actions, 'getBooleanInput').mockImplementation(() => true);
  jest.spyOn(actions, 'getInputAsArray').mockImplementation(() => ['XXX']);
});

afterEach(() => {
  delete process.env['GITHUB_EVENT_NAME'];
  delete process.env['GITHUB_REF'];
});

describe('test runs', () => {
  test('restore.js', async () => {
    await run();

    const getStateMock = jest.spyOn(actions, 'getState').mockImplementation(() => 'XXX');
    const saveStateMock = jest.spyOn(actions, 'saveState');
    const logInfoMock = jest.spyOn(actions, 'logInfo');
    const logWarningMock = jest.spyOn(actions, 'logWarning');

    expect(getStateMock).toHaveBeenCalledTimes(1);
    expect(saveStateMock).toHaveBeenCalledTimes(0);
    expect(logInfoMock).toHaveBeenCalledTimes(1);
    expect(logWarningMock).toHaveBeenCalledTimes(0);
  });
});
