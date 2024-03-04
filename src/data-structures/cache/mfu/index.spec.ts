import { beforeEach, describe, expect, it } from 'vitest';
import { MFUCache } from './index';

describe('MFUCache', () => {
  let cache: MFUCache<string, number>;

  // Arrange
  beforeEach(() => {
    cache = new MFUCache(2);
  });

  it('returns initial state correctly', () => {
    // Assert
    expect(cache.isEmpty).toBeTruthy();
    expect(cache.toArray()).toEqual([]);
    expect(cache.size).toBe(0);
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
      // [1] -> 1

      // Assert
      expect(cache.isEmpty).toBeFalsy();
      expect(cache.toArray()).toEqual([1]);
      expect(cache.size).toBe(1);
    });

    it('adds second item', () => {
      // Arrange
      cache.put('a', 1);

      // Act
      cache.put('b', 2);
      // [1] -> 1, 2

      // Assert
      expect(cache.toArray()).toEqual([1, 2]);
      expect(cache.size).toBe(2);
    });

    it('updates value of existing item', () => {
      // Arrange
      cache.put('a', 1);

      // Act
      cache.put('a', 2);
      // [2] -> 2

      // Assert
      expect(cache.toArray()).toEqual([2]);
      expect(cache.size).toBe(1);
    });

    it('updates first item', () => {
      // Arrange
      cache.put('a', 1);
      cache.put('b', 2);
      //

      // Act
      cache.put('a', 3);
      // [1] -> 2
      // [2] -> 3

      // Assert
      expect(cache.toArray()).toEqual([2, 3]);
      expect(cache.size).toBe(2);
    });

    it('updates existing items', () => {
      // Arrange
      const mfu = new MFUCache(3);

      // Act
      mfu.put('a', 1);
      mfu.put('b', 2).put('b', 2).put('b', 2);
      mfu.put('c', 3).put('c', 3).put('c', 3).put('c', 3).put('c', 3);
      // [1] -> 1
      // [3] -> 2
      // [5] -> 3

      // Assert
      expect(mfu.toArray()).toEqual([1, 2, 3]);
      expect(mfu.size).toBe(3);
    });

    it('evicts the previous one item before the newest one item when capacity reached', () => {
      // Arrange
      cache.put('one', 1);
      cache.put('two', 2);
      // [1] -> 1, 2

      // Act
      cache.put('three', 3); // Should evict 2
      // [1] -> 1, 3

      // Assert
      expect(cache.toArray()).toEqual([1, 3]);
      expect(cache.size).toBe(2);
    });

    it('evicts the most frequently used item when capacity reached', () => {
      // Arrange
      const mfu = new MFUCache<string, number>(2);
      mfu.put('one', 1).put('one', 1);
      mfu.put('two', 2).put('two', 2).put('two', 2).put('two', 2);
      // [2] -> 1
      // [4] -> 2

      // Act
      mfu.put('three', 3); // Should evict 2
      // [1] -> 3
      // [2] -> 1

      // Assert
      expect(mfu.toArray()).toEqual([3, 1]);
      expect(mfu.size).toBe(2);
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
      // [1] -> 1, 2

      // Act and Assert
      expect(cache.get('one')).toBe(1);
      // [1] -> 2
      // [2] -> 1

      expect(cache.toArray()).toEqual([2, 1]);
      expect(cache.size).toBe(2);
    });

    it('returns the values of the items', () => {
      // Arrange
      cache.put('one', 1);
      cache.put('two', 2);
      // [1] -> 1, 2

      // Act and Assert
      expect(cache.get('one')).toBe(1);
      expect(cache.get('two')).toBe(2);
      // [2] -> 1, 2

      expect(cache.toArray()).toEqual([1, 2]);
      expect(cache.size).toBe(2);
    });

    it('evicts the most frequently used item', () => {
      // Arrange
      const mfu = new MFUCache<string, number>(2);
      mfu.put('one', 1);
      mfu.get('one');

      mfu.put('two', 1);
      mfu.get('two');
      mfu.get('two');
      mfu.get('two');
      // [2] -> 1
      // [4] -> 2

      // Act
      mfu.put('three', 3); // Should evict 2
      // [1] -> 3
      // [2] -> 1

      // Assert
      expect(mfu.toArray()).toEqual([3, 1]);
      expect(mfu.size).toBe(2);
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

      expect(cache.isEmpty).toBeTruthy();
      expect(cache.toArray()).toEqual([]);
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
