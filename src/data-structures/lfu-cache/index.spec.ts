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

  it('adds value to empty cache', () => {
    // Act
    cache.put('one', 1);

    // Assert
    expect(cache.size).toBe(1);
  });

  it('adds value to non-empty cache', () => {
    // Arrange
    cache.put('one', 1);

    // Act
    cache.put('two', 2);

    // Assert
    expect(cache.size).toBe(2);
  });

  it('puts value in loaded cache', () => {
    // Arrange
    cache.put('one', 1).put('two', 2);

    // Act
    cache.put('three', 3);

    // Assert
    expect(cache.size).toBe(2);
  });
});
