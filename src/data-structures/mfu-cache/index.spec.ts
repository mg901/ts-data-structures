import { describe, expect, it } from 'vitest';
import { MFUCache } from './index';

describe('MFUCache', () => {
  it('return initial state correctly', () => {
    // Arrange
    const cache = new MFUCache(2);

    // Assert
    expect(cache.size).toBe(0);
  });

  describe('put', () => {
    it('adds item to the cache', () => {
      // Arrange
      const cache = new MFUCache(2);

      // Act
      cache.put('one', 1);

      // Assert
      expect(cache.size).toBe(1);
    });

    it('fills the cache', () => {
      // Arrange
      const cache = new MFUCache(2);

      // Act
      cache.put('one', 1);
      cache.put('two', 2);

      // Assert
      expect(cache.size).toBe(2);
    });

    it('overwrites the value by the key', () => {
      // Arrange
      const cache = new MFUCache(2);
      cache.put('one', 1);

      // Act
      cache.put('one', 2);

      // Assert
      expect(cache.size).toBe(1);
    });

    it('evicts the most frequently used item', () => {
      // Arrange
      const cache = new MFUCache(2);
      cache.put('one', 1);
      cache.put('two', 2);

      // Act
      cache.put('three', 3);

      // Assert
      expect(cache.size).toBe(2);
    });
  });

  describe('get', () => {
    it('returns null for a non-existing item', () => {
      // Arrange
      const cache = new MFUCache(1);

      // Act and Assert
      expect(cache.get('one')).toBeNull();
    });

    it('returns value of existing item', () => {
      // Arrange
      const cache = new MFUCache(2);
      cache.put('one', 1);
      cache.put('two', 2);

      // Act and Assert
      expect(cache.get('one')).toBe(1);
      expect(cache.size).toBe(2);
    });

    it('returns the values of the items', () => {
      // Arrange
      const cache = new MFUCache(2);
      cache.put('one', 1);
      cache.put('two', 2);

      // Act and Assert
      expect(cache.get('one')).toBe(1);
      expect(cache.get('two')).toBe(2);
      expect(cache.size).toBe(2);
    });

    it('evicts the most frequently item', () => {
      // Arrange
      const cache = new MFUCache(3);
      cache.put('one', 1);
      cache.put('two', 2);
      cache.put('three', 3);

      cache.get('one');
      cache.get('three');
      cache.get('three');

      cache.get('two');

      // Act
      cache.put('four', 4);

      // Assert
      expect(cache.get('four')).toBe(4);
      expect(cache.size).toBe(3);
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
