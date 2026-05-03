import { beforeEach, describe, expect, it } from 'vitest';
import { LRUCache } from './index';

describe('LRUCacheOnMap', () => {
  let cache: LRUCache<string, number>;

  // Arrange
  beforeEach(() => {
    cache = new LRUCache<string, number>(3);
  });

  it('returns initial state correctly', () => {
    // Act and Assert
    expect(cache.size).toBe(0);
  });

  describe('put', () => {
    it('adds and overwrites items correctly', () => {
      // Arrange
      cache.put('a', 1);
      cache.put('b', 2);
      cache.put('a', 3);

      // Act and Assert
      expect(cache.size).toBe(2);
    });

    it('evicts least recently used item when exceeding capacity', () => {
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

  describe('get', () => {
    it('returns null for a missing item', () => {
      // Act and Assert
      expect(cache.get('missing')).toBeNull();
    });

    it('retrieves item and updates order correctly', () => {
      // Arrange
      cache.put('one', 1);
      cache.put('two', 2);
      cache.get('one');

      // Act
      cache.put('three', 3);
      cache.put('four', 4); // Should evict 'two'

      // Assert
      expect(cache.get('two')).toBeNull();
      expect(cache.size).toBe(3);
    });
  });

  it('clears the cache', () => {
    // Arrange
    cache.put('a', 1);
    cache.put('b', 2);
    cache.put('c', 3);

    // Act
    cache.clear();

    // Assert
    expect(cache.size).toBe(0);
  });
});
