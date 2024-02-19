import { beforeEach, describe, expect, it } from 'vitest';
import { LFUCache } from './index';

describe('LFUCache', () => {
  let cache: LFUCache<string, number>;

  // Arrange
  beforeEach(() => {
    cache = new LFUCache(2);
  });

  it('returns initial state correctly', () => {
    // Act and Assert
    expect(cache).toBeDefined();
    expect(cache.size).toBe(0);
  });

  it('handles put in empty cache', () => {
    // Arrange
    cache.put('one', 1);

    // Assert
    expect(cache.size).toBe(1);
  });
});
