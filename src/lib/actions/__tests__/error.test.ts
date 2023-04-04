import { describe, expect, test } from '@jest/globals';
import { ValidationError, ApiRequestError, FileStreamError, ArchiveFileError } from '@/lib/actions/error';

describe('ValidationError', () => {
  test('初期化後、nameにValidationErrorが格納されている', () => {
    const error = new ValidationError('xxx');
    expect(error.name).toBe('ValidationError');
  });

  describe('ApiRequestError', () => {
    test('初期化後、nameにApiRequestErrorが格納されている', () => {
      const error = new ApiRequestError('xxx');
      expect(error.name).toBe('ApiRequestError');
    });
  });

  describe('FileStreamError', () => {
    test('初期化後、nameにFileStreamErrorが格納されている', () => {
      const error = new FileStreamError('xxx');
      expect(error.name).toBe('FileStreamError');
    });
  });

  describe('ArchiveFileError', () => {
    test('初期化後、nameにArchiveFileErrorが格納されている', () => {
      const error = new ArchiveFileError('xxx');
      expect(error.name).toBe('ArchiveFileError');
    });
  });
});
