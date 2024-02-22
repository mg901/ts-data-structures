import { describe, expect, it } from 'vitest';
import { LFUCache } from './index';

describe('LFUCache', () => {
  it('returns initial state correctly', () => {
    expect(new LFUCache(2).size).toBe(0);
  });

  describe('put', () => {
    it('increases size when adding items', () => {
      // Arrange
      const cache = new LFUCache(2);
      expect(cache.size).toBe(0);

      // Act
      cache.put('one', 1);

      // Assert
      expect(cache.size).toBe(1);
    });

    it('saves size in case of overflow', () => {
      const cache = new LFUCache(2);

      // Act
      cache.put('one', 1).put('two', 2).put('three', 3);

      // Assert
      expect(cache.get('one')).toBe(-1);
      expect(cache.get('two')).toBe(2);
      expect(cache.get('three')).toBe(3);
      expect(cache.size).toBe(2);
    });

    it('another test', () => {
      // Arrange
      const cache = new LFUCache(3);
      cache.put('one', 1).put('two', 2).put('three', 3);

      cache.get('one');
      cache.get('two');
      cache.get('three');

      cache.get('three');
      cache.put('four', 4);
      expect(cache.size).toBe(3);
    });
  });

  describe('get', () => {
    it('returns -1 for non-existing key', () => {
      const cache = new LFUCache(1);

      expect(cache.get('three')).toBe(-1);
      expect(cache.size).toBe(0);
    });

    it('returns the value of an existing item by key', () => {
      const cache = new LFUCache(1);

      cache.put('one', 1);

      expect(cache.get('one')).toBe(1);
      expect(cache.size).toBe(1);
    });
  });
});
