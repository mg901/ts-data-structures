import { beforeEach, describe, expect, it } from 'vitest';
import { MFUCache } from './index';

describe('MFUCache', () => {
  let cache: MFUCache<string, number>;

  // Arrange
  beforeEach(() => {
    cache = new MFUCache(3);
  });

  it('returns initial state correctly', () => {
    // Assert
    expect(cache.size).toBe(0);
  });

  describe('put', () => {
    it('adds item to the cache', () => {
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
      cache.put('three', 3);

      // Assert
      expect(cache.toArray()).toEqual([1, 2, 3]);
      expect(cache.size).toBe(3);
    });

    it('overwrites the value by the key', () => {
      // Arrange
      cache.put('one', 1);

      // Act
      cache.put('one', 2);

      // Assert
      expect(cache.toArray()).toEqual([2]);
      expect(cache.size).toBe(1);
    });

    it('evicts the most frequently used item', () => {
      // Arrange
      cache.put('one', 1);
      cache.put('two', 2);
      cache.put('three', 3);

      // Act
      cache.put('four', 4); // Should evict 3

      // Assert
      expect(cache.toArray()).toEqual([1, 2, 4]);
      expect(cache.size).toBe(3);
    });
  });

  describe('get', () => {
    it('returns null for a non-existing item', () => {
      // Act and Assert
      expect(cache.get('one')).toBeNull();
    });

    it('returns value of existing item', () => {
      // Arrange
      cache.put('one', 1);
      cache.put('two', 2);

      // Act and Assert
      expect(cache.get('one')).toBe(1);
      expect(cache.toArray()).toEqual([2, 1]);
      expect(cache.size).toBe(2);
    });

    it('returns the values of the items', () => {
      // Arrange
      cache.put('one', 1);
      cache.put('two', 2);

      // Act and Assert
      expect(cache.get('one')).toBe(1);
      expect(cache.get('two')).toBe(2);
      expect(cache.toArray()).toEqual([1, 2]);
      expect(cache.size).toBe(2);
    });

    it('evicts the most frequently item', () => {
      // Arrange
      cache.put('one', 1);
      cache.put('two', 2);
      cache.put('three', 3);
      // [1] -> 1, 2, 3
      expect(cache.toArray()).toEqual([1, 2, 3]);

      cache.get('one');
      cache.get('three');
      cache.get('three');
      // [1] -> 2
      // [2] -> 1
      // [3] -> 3
      expect(cache.toArray()).toEqual([2, 1, 3]);

      cache.get('two');
      // [2] -> 1, 2
      // [3] -> 3
      expect(cache.toArray()).toEqual([1, 2, 3]);

      // Act
      cache.put('four', 4); // Should evict 3
      // [1] -> 4
      // [2] -> 1, 2

      // Assert
      expect(cache.get('three')).toBeNull();
      expect(cache.toArray()).toEqual([4, 1, 2]);
      expect(cache.size).toBe(3);
    });
  });

  describe('clear', () => {
    it('clears cache correctly', () => {
      // Arrange
      cache.put('one', 1);
      cache.put('two', 2);
      cache.put('three', 3);

      // Act
      cache.clear();

      // Assert
      expect(cache.get('one')).toBeNull();
      expect(cache.get('two')).toBeNull();
      expect(cache.get('three')).toBeNull();
      // FIXME: replace toBe with toEqual
      expect(cache.toArray()).toBe([]);
      expect(cache.size).toBe(0);
    });
  });

  describe('toStringTag', () => {
    it('returns correct string representation', () => {
      // Assert
      expect(Object.prototype.toString.call(new MFUCache(3))).toBe(
        '[object MFUCache]',
      );
    });
  });
});
