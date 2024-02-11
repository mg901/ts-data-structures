import { beforeEach, describe, expect, it, vi } from 'vitest';
import { HashMap } from './index';

describe('HashMap', () => {
  let hashMap: HashMap<string, number>;

  // Arrange;
  beforeEach(() => {
    hashMap = new HashMap<string, number>();
  });

  it('returns the initial state of the HashMap correctly', () => {
    // Act and Assert
    expect(hashMap.size).toBe(0);
  });

  describe('set', () => {
    it('set values', () => {
      // Act
      hashMap.set('one', 1);
      hashMap.set('two', 2);

      // Assert
      const received = Object.fromEntries(hashMap.entries());

      expect(received).toEqual({
        one: 1,
        two: 2,
      });

      expect(hashMap.size).toBe(2);
    });

    it('updates existing values', () => {
      // Act
      hashMap.set('value', 1);
      hashMap.set('value', 2);

      // Assert
      expect(hashMap.get('value')).toBe(2);
    });
  });

  describe('keys', () => {
    it('returns an iterator with all keys', () => {
      // Arrange
      hashMap.set('one', 1);
      hashMap.set('two', 2);
      hashMap.set('three', 3);

      const expected = ['one', 'two', 'three'];

      // Act
      const received = Array.from(hashMap.keys());

      // Assert
      expect(received).toEqual(expected);
    });

    it('returns an empty iterator for an empty HashMap', () => {
      // Act
      const emptyKeysIterator = hashMap.keys();

      // Assert
      expect(Array.from(emptyKeysIterator)).toEqual([]);
      expect(Array.from(emptyKeysIterator)).toHaveLength(0);
    });

    it('returns unique keys even with duplicate entries', () => {
      // Arrange
      hashMap.set('one', 1);
      hashMap.set('two', 2);
      hashMap.set('one', 3);

      // Act
      const keysIterator = hashMap.keys();
      const keysArray = Array.from(keysIterator);

      // Assert
      expect(keysArray).toEqual(expect.arrayContaining(['one', 'two']));
      expect(keysArray).toHaveLength(2);
    });

    it('returns an iterator with all keys including colliding keys', () => {
      // Arrange
      const map = new HashMap<string, number>(5);

      map.set('one', 1);
      map.set('two', 2);
      map.set('three', 3);
      map.set('neo', 4); // Collision with 'one'

      // Act
      const keysIterator = map.keys();
      const keysArray = Array.from(keysIterator);

      // Assert
      expect(keysArray).toEqual(
        expect.arrayContaining(['one', 'two', 'three', 'neo']),
      );
      expect(keysArray).toHaveLength(4);
    });

    it('returns an iterator with all unique keys for colliding entries', () => {
      // Arrange
      const map = new HashMap<string, number>(5);

      map.set('one', 1);
      map.set('two', 2);
      map.set('three', 3);
      map.set('neo', 4); // Collision with 'one'
      map.set('one', 5); // Addition with the same collision-causing key

      // Act
      const keysIterator = map.keys();
      const keysArray = Array.from(keysIterator);

      // Assert
      expect(keysArray).toEqual(
        expect.arrayContaining(['one', 'two', 'three', 'neo']),
      );
      expect(keysArray).toHaveLength(4);
    });
  });

  describe('values', () => {
    it('returns an iterator with all values', () => {
      // Arrange
      hashMap.set('one', 1);
      hashMap.set('two', 2);
      hashMap.set('three', 3);

      const expected = [1, 2, 3];

      // Act
      const received = Array.from(hashMap.values());

      // Assert
      expect(received).toEqual(expected);
    });

    it('returns an empty iterator for an empty HashMap', () => {
      // Act and Assert
      expect(Array.from(hashMap.values())).toEqual([]);
    });
  });

  describe('entries', () => {
    it('returns an iterator with all entries', () => {
      // Arrange
      hashMap.set('one', 1);
      hashMap.set('two', 2);
      hashMap.set('three', 3);

      const expected = [
        ['one', 1],
        ['two', 2],
        ['three', 3],
      ];

      // Act
      const received = Array.from(hashMap.entries());

      // Assert
      expect(received).toEqual(expected);
    });

    it('returns an empty iterator for an empty HashMap', () => {
      // Act and Assert
      expect(Array.from(hashMap.entries())).toEqual([]);
    });
  });

  describe('get', () => {
    it('handles a non-existing key in an empty HashMap', () => {
      // Act and Assert
      expect(hashMap.get('one')).toBeUndefined();
      expect(hashMap.size).toBe(0);
    });

    it('handles a non-existing key in a non-empty HashMap', () => {
      // Arrange
      hashMap.set('one', 1);

      // Act and Assert
      expect(hashMap.get('two')).toBeUndefined();
      expect(hashMap.size).toBe(1);
    });

    it('returns the value for an existing key in a non-empty HashMap', () => {
      // Act
      hashMap.set('key', 10);

      // Assert
      expect(hashMap.get('key')).toBe(10);
      expect(hashMap.size).toBe(1);
    });

    it('returns the values for existing keys in a non-empty HashMap', () => {
      // Act
      hashMap.set('ten', 10);
      hashMap.set('twenty', 20);

      // Assert
      expect(hashMap.get('ten')).toBe(10);
      expect(hashMap.get('twenty')).toBe(20);
      expect(hashMap.size).toBe(2);
    });
  });

  describe('has', () => {
    it('checks if a key exists using has method ', () => {
      // Arrange
      hashMap.set('one', 1);
      hashMap.set('two', 2);

      // Act and Assert
      expect(hashMap.has('one')).toBeTruthy();
      expect(hashMap.has('two')).toBeTruthy();
      expect(hashMap.has('three')).toBeFalsy();
    });
  });

  describe('delete', () => {
    it('deletes a none-existing value in a an empty HashMap', () => {
      // Act
      const received = hashMap.delete('non-existing-key');

      // Assert
      expect(hashMap.size).toBe(0);
      expect(received).toBeFalsy();
    });

    it('deletes existing values for existing keys in a non-empty HashMap', () => {
      // Arrange
      hashMap.set('one', 1);
      hashMap.set('two', 2);

      // Act and Assert
      expect(hashMap.delete('one')).toBeTruthy();
      expect(hashMap.size).toBe(1);
      expect(hashMap.delete('two')).toBeTruthy();
      expect(hashMap.size).toBe(0);
    });
  });

  describe('forEach', () => {
    it('iterates over each the key-value pairs', () => {
      // Arrange
      hashMap.set('one', 1);
      hashMap.set('two', 2);
      hashMap.set('three', 3);

      const callbackFn = vi.fn();

      // Act
      hashMap.forEach(callbackFn);

      // Assert
      expect(callbackFn).toHaveBeenCalledTimes(3);
    });

    it('uses the provided thisArg as the context if provided', () => {
      // Arrange
      hashMap.set('one', 1);

      const thisArg = { customContext: true };
      const callbackFn = vi.fn();

      // Act
      hashMap.forEach(callbackFn, thisArg);

      // Assert
      expect(callbackFn.mock.calls[0][2]).toBe(thisArg);
    });

    it('uses the HashMap as the context if thisArg is not provided', () => {
      // Arrange
      hashMap.set('one', 1);

      const callbackFn = vi.fn();

      // Act
      hashMap.forEach(callbackFn);

      // Assert
      expect(callbackFn.mock.calls[0][2]).toBe(hashMap);
    });
  });

  describe('clear', () => {
    it('clears the HashMap', () => {
      // Arrange
      hashMap.set('one', 1);
      hashMap.set('two', 2);

      // Act
      hashMap.clear();

      // Assert
      expect(hashMap.get('one')).toBeUndefined();
      expect(hashMap.get('two')).toBeUndefined();
      expect(hashMap.size).toBe(0);
    });
  });
});
