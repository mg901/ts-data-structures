import { describe, expect, it } from 'vitest';
import { CustomPromise } from './custom-promise';

describe('CustomPromise', () => {
  it('resolves with value', async () => {
    const result = await new CustomPromise<number>((resolve) => {
      setTimeout(() => resolve(42), 100);
    });

    expect(result).toBe(42);
  });
});
