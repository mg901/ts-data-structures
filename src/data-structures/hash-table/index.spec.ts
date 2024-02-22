import { beforeEach, describe, expect, it } from 'vitest';
import { HashTable } from './index';

describe('HashTable', () => {
  let hashTable: HashTable<string, number>;

  // Arrange;
  beforeEach(() => {
    hashTable = new HashTable<string, number>();
  });

  it('returns the initial state correctly', () => {
    // Act and Assert
    expect(hashTable.size).toBe(0);
  });

  describe('set', () => {
    it('sets values correctly', () => {
      // Act
      hashTable
        .set('one', 1)
        .set('two', 2)
        .set('three', 3)
        .set('four', 4)
        .set('five', 5)
        .set('six', 6);

      // Assert
      expect(hashTable.get('one')).toEqual(1);
      expect(hashTable.get('two')).toEqual(2);
      expect(hashTable.get('three')).toEqual(3);
      expect(hashTable.get('four')).toEqual(4);
      expect(hashTable.get('five')).toEqual(5);
      expect(hashTable.get('six')).toEqual(6);

      expect(hashTable.size).toBe(6);
    });

    it('updates existing values', () => {
      // Act
      hashTable.set('value', 1).set('value', 2);

      // Assert
      expect(hashTable.get('value')).toBe(2);
    });
  });

  describe('get', () => {
    it('handles a non-existing key in an empty HashTable', () => {
      // Act and Assert
      expect(hashTable.get('one')).toBeUndefined();
      expect(hashTable.size).toBe(0);
    });
  });

  describe('has', () => {
    it('checks if a key exists using has method', () => {
      // Arrange
      hashTable.set('one', 1).set('two', 2);

      // Act and Assert
      expect(hashTable.has('one')).toBeTruthy();
      expect(hashTable.has('two')).toBeTruthy();
      expect(hashTable.has('three')).toBeFalsy();
    });
  });

  describe('delete', () => {
    it('deletes a none-existing value', () => {
      // Act
      const received = hashTable.delete('non-existing-key');

      // Assert
      expect(hashTable.size).toBe(0);
      expect(received).toBeFalsy();
    });

    it('deletes existing values for existing keys', () => {
      // Arrange
      hashTable.set('one', 1);
      hashTable.set('two', 2);

      // Act and Assert
      expect(hashTable.delete('one')).toBeTruthy();
      expect(hashTable.size).toBe(1);

      expect(hashTable.delete('two')).toBeTruthy();
      expect(hashTable.size).toBe(0);
    });
  });

  describe('clear', () => {
    it('clears the HashMap', () => {
      // Arrange
      hashTable.set('one', 1);
      hashTable.set('two', 2);

      // Act
      hashTable.clear();

      // Assert
      expect(hashTable.get('one')).toBeUndefined();
      expect(hashTable.get('two')).toBeUndefined();
      expect(hashTable.size).toBe(0);
    });
  });

  describe('toStringTag', () => {
    it('returns correct string representation', () => {
      // Assert
      expect(Object.prototype.toString.call(new HashTable())).toBe(
        '[object HashTable]',
      );
    });
  });
});
