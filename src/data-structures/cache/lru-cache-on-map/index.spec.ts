import { beforeEach, describe, expect, it } from 'vitest';
import { LRUCache } from './index';

describe('LRUCacheOnMap', () => {
  let cache: LRUCache<string, number>;

  // Arrange
  beforeEach(() => {
    cache = new LRUCache<string, number>(2);

    cache.put('one', 1);
    cache.put('two', 2);
  });

  describe('toStringTag', () => {
    it('returns correct string representation', () => {
      // Assert
      expect(Object.prototype.toString.call(new LRUCache(6))).toBe(
        '[object LRUCache]',
      );
    });
  });

  it('stores and retrieve values', () => {
    // Assert
    expect(cache.get('one')).toBe(1);
    expect(cache.get('two')).toBe(2);
  });

  it('evicts least recently used item when exceeding capacity', () => {
    // Act
    cache.get('one'); // Move 1 to the front
    cache.put('three', 3); // Should evict 2

    // Assert
    expect(cache.get('one')).toBe(1);
    expect(cache.get('two')).toBe(-1);
    expect(cache.get('three')).toBe(3);
  });

  it('updates value for an existing key', () => {
    // Arrange
    cache.put('value', 10);
    expect(cache.get('value')).toBe(10);

    // Act
    cache.put('value', 20);

    // Assert
    expect(cache.get('value')).toBe(20);
  });
});
