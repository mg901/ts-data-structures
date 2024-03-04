import { beforeEach, describe, expect, it } from 'vitest';
import { LFUCache } from './index';

describe('LFUCache', () => {
  let cache: LFUCache<string, number>;

  // Arrange
  beforeEach(() => {
    cache = new LFUCache(2);
  });
  it('returns initial state correctly', () => {
    expect(cache.size).toBe(0);
    expect(cache.toArray()).toEqual([]);
    expect(cache.isEmpty).toBeTruthy();
  });

  describe('toArray', () => {
    it('returns values of items', () => {
      // Arrange
      cache.put('a', 1);
      cache.put('b', 2);

      // Act and Assert
      expect(cache.toArray()).toEqual([1, 2]);
    });

    it('returns keys of items', () => {
      // Arrange
      cache.put('a', 1);
      cache.put('b', 2);

      // Act and Assert
      expect(cache.toArray(({ key }) => key)).toEqual(['a', 'b']);
    });
  });

  describe('put', () => {
    it('adds first item', () => {
      // Act
      cache.put('a', 1);

      // Assert
      expect(cache.toArray()).toEqual([1]);
      expect(cache.size).toBe(1);
    });

    it('adds second item', () => {
      // Act
      cache.put('a', 1);

      // Assert
      expect(cache.toArray()).toEqual([1]);
      expect(cache.size).toBe(1);
    });

    it('updates value for existing item', () => {
      // Arrange
      cache.put('a', 1);

      // Act
      cache.put('a', 2);

      // Assert
      expect(cache.toArray()).toEqual([2]);
      expect(cache.size).toBe(1);
    });

    it('evicts least frequently used item when capacity reached', () => {
      // Arrange
      const lfu = new LFUCache<string, number>(3);

      lfu.put('a', 1);
      lfu.put('b', 2);
      lfu.put('c', 3);
      // [1] -> 1, 2, 3

      lfu.put('a', 1);
      lfu.put('b', 2);
      // [1] -> 3
      // [2] -> 1, 2

      // Act
      lfu.put('d', 4); // Evicts 3 ('c') because it's least frequently used
      // [1] -> 4
      // [2] -> 1, 2

      // Assert
      expect(lfu.toArray()).toEqual([4, 1, 2]);
      expect(lfu.size).toBe(3);
    });
  });

  describe('get', () => {
    it('returns null for non-existing value', () => {
      // Arrange
      cache.put('a', 1);

      // Assert
      expect(cache.get('b')).toBeNull();
      expect(cache.size).toBe(1);
    });

    it('returns the value of the item', () => {
      // Arrange
      cache.put('a', 1);

      // Act and Assert
      expect(cache.get('a')).toBe(1);
      expect(cache.toArray()).toEqual([1]);
      expect(cache.size).toBe(1);
    });

    it('evicts least frequently used item when capacity reached', () => {
      // Arrange
      const lfu = new LFUCache<string, number>(3);
      lfu.put('a', 1);
      lfu.put('b', 2);
      lfu.put('c', 3);
      // [1] -> 1, 2, 3

      lfu.get('a');
      lfu.get('b');
      // [1] -> 3
      // [2] -> 1, 2

      // Act
      lfu.put('d', 4); // Evicts 3 ('c') because it's least frequently used
      // [1] -> 4
      // [2] -> 1, 2

      // Assert
      expect(lfu.toArray()).toEqual([4, 1, 2]);
      expect(lfu.get('c')).toBeNull();
      expect(lfu.get('d')).toBe(4);
      expect(lfu.get('a')).toBe(1);
      expect(lfu.get('b')).toBe(2);
      expect(lfu.size).toBe(3);
    });
  });

  it('clears the cache', () => {
    // Arrange
    const lfu = new LFUCache<string, number>(3);
    lfu.put('a', 1);
    lfu.put('b', 2);
    lfu.put('c', 3);

    expect(lfu.toArray()).toEqual([1, 2, 3]);
    expect(lfu.isEmpty).toBeFalsy();

    // Act
    lfu.clear();

    // Assert
    expect(lfu.toArray()).toEqual([]);
    expect(lfu.isEmpty).toBeTruthy();
    expect(lfu.size).toBe(0);
  });

  describe('toStringTag', () => {
    it('returns correct string representation', () => {
      // Assert
      expect(Object.prototype.toString.call(new LFUCache(6))).toBe(
        '[object LFUCache]',
      );
    });
  });
});
