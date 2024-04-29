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

      expect(hashTable.size).toBe(6);
    });

    it('updates existing value', () => {
      // Act
      hashTable.set('value', 1).set('value', 2);

      // Assert
      expect(hashTable.get('value')).toBe(2);
    });
  });

  describe('get', () => {
    it('handles a non-existing key', () => {
      // Act and Assert
      expect(hashTable.get('one')).toBeUndefined();
      expect(hashTable.size).toBe(0);
    });

    it('returns the value by the key', () => {
      // Arrange
      hashTable.set('one', 1);

      // Act and Assert
      expect(hashTable.get('one')).toBe(1);
    });
  });

  describe('has', () => {
    it('checks if a key exists in a hash table', () => {
      // Arrange
      hashTable.set('one', 1).set('two', 2);

      // Act and Assert
      expect(hashTable.has('one')).toBeTruthy();
      expect(hashTable.has('two')).toBeTruthy();
      expect(hashTable.has('three')).toBeFalsy();
    });
  });

  describe('delete', () => {
    it('deletes existing values correctly', () => {
      // Arrange
      hashTable.set('one', 1);
      hashTable.set('two', 2);

      // Act and Assert
      expect(hashTable.delete('one')).toBeTruthy();
      expect(hashTable.size).toBe(1);

      expect(hashTable.delete('two')).toBeTruthy();
      expect(hashTable.size).toBe(0);
    });

    it('deletes a none-existing value', () => {
      // Act
      const received = hashTable.delete('non-existing-key');

      // Assert
      expect(hashTable.size).toBe(0);
      expect(received).toBeFalsy();
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
