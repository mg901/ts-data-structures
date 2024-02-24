import { beforeEach, describe, expect, it } from 'vitest';
import { LRUCache } from './index';

describe('LRUCacheOnMap', () => {
  let cache: LRUCache<string, number>;

  // Arrange
  beforeEach(() => {
    cache = new LRUCache<string, number>(3);
  });

  describe('put', () => {
    it('adds item correctly', () => {
      // Act
      cache.put('one', 1);

      // Assert
      expect(cache.toArray()).toEqual([1]);
      expect(cache.size).toBe(1);
    });

    it('fills the cache', () => {
      // Act
      cache.put('one', 1);
      cache.put('two', 2);

      // Assert
      expect(cache.toArray()).toEqual([1, 2]);
      expect(cache.size).toBe(2);
    });

    it(`overwrites item's value correctly`, () => {
      // Arrange
      cache.put('key', 1);

      // Act
      cache.put('key', 2);

      // Assert
      expect(cache.toArray()).toEqual([2]);
      expect(cache.size).toBe(1);
    });

    it('returns the correct size when exceeding capacity', () => {
      // Arrange
      cache.put('one', 1);
      cache.put('two', 2);
      cache.put('three', 3);
      // 2, 3, 4

      // Act
      cache.put('four', 4);

      // Assert
      expect(cache.toArray()).toEqual([2, 3, 4]);
      expect(cache.size).toBe(3);
    });
  });

  describe('get', () => {
    it('returns null for a non-existing item', () => {
      // Act and Assert
      expect(cache.get('one')).toBeNull();
    });

    it(`returns item's value correctly`, () => {
      // Arrange
      cache.put('one', 1);

      // Act and Assert
      expect(cache.toArray()).toEqual([1]);
      expect(cache.size).toBe(1);
    });

    it('evicts the least recently used item when exceeding capacity', () => {
      // Arrange
      cache.put('one', 1);
      cache.put('two', 2);
      cache.put('three', 3);
      cache.get('one');

      // Act
      cache.put('four', 4); // Should evict 2

      // Assert
      expect(cache.get('two')).toBeNull();
      expect(cache.toArray()).toEqual([3, 1, 4]);
      expect(cache.size).toBe(3);
    });
  });

  describe('toStringTag', () => {
    it('returns correct string representation', () => {
      // Assert
      expect(Object.prototype.toString.call(new LRUCache(6))).toBe(
        '[object LRUCache]',
      );
    });
  });
});
