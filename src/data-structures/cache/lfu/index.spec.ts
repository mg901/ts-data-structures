import { beforeEach, describe, expect, it } from 'vitest';
import { LFUCache } from './index';

describe('LFUCache', () => {
  it('returns initial state correctly', () => {
    const cache = new LFUCache(0);

    expect(cache.size).toBe(0);
    expect(cache.toArray()).toEqual([]);
    expect(cache.isEmpty).toBeTruthy();
  });

  describe('put', () => {
    let cache: LFUCache<string, number>;

    // Arrange
    beforeEach(() => {
      cache = new LFUCache(2);
    });

    it('puts new item', () => {
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
    let cache: LFUCache<string, number>;

    // Arrange
    beforeEach(() => {
      cache = new LFUCache(2);
    });

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
    const cache = new LFUCache<string, number>(3);
    cache.put('a', 1);
    cache.put('b', 2);
    cache.put('c', 3);

    expect(cache.toArray()).toEqual([1, 2, 3]);
    expect(cache.isEmpty).toBeFalsy();

    // Act
    cache.clear();

    // Assert
    expect(cache.toArray()).toEqual([]);
    expect(cache.isEmpty).toBeTruthy();
    expect(cache.size).toBe(0);
  });
});
