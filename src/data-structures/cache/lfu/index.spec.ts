import { beforeEach, describe, expect, it } from 'vitest';
import { LFUCache } from './index';

describe('LFUCache', () => {
  let cache: LFUCache<string, number>;

  // Arrange
  beforeEach(() => {
    cache = new LFUCache(3);
  });

  it('returns initial state correctly', () => {
    expect(cache.size).toBe(0);
  });

  describe('put', () => {
    it('increases the size when adding item', () => {
      // Act
      cache.put('one', 1);

      // Assert
      expect(cache.size).toBe(1);
    });
  });

  it(`doesn't increase size on the cache overflow`, () => {
    // Arrange
    cache.put('one', 1);
    cache.put('two', 2);
    cache.put('three', 3);

    // Act
    cache.put('four', 4);

    // Assert
    expect(cache.size).toBe(3);
  });
});
