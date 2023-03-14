import { describe, expect, test } from '@jest/globals';
import { ValidationError, ReserveCacheError } from '@/lib/actions/error';

describe('ValidationError', () => {
  test('初期化後、nameにValidationErrorが格納されている', () => {
    const error = new ValidationError('xxx');
    expect(error.name).toBe('ValidationError');
  });

  describe('ReserveCacheError', () => {
    test('初期化後、nameにReserveCacheErrorが格納されている', () => {
      const error = new ReserveCacheError('xxx');
      expect(error.name).toBe('ReserveCacheError');
    });
  });
});
