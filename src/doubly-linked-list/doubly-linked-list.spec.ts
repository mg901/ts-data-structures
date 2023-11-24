import { describe, beforeEach, it, expect } from 'vitest';
import { DoublyLinkedList } from './doubly-linked-list';

describe('DoublyLinkedList', () => {
  // @ts-ignore
  let doublyLinkedList = null as DoublyLinkedList<number>;

  // Arrange
  beforeEach(() => {
    doublyLinkedList = new DoublyLinkedList<number>();
  });

  it('returns the initial state correctly', () => {
    // Act and Assert
    expect(doublyLinkedList.head).toBeNull();
    expect(doublyLinkedList.tail).toBeNull();
    expect(doublyLinkedList.length).toBe(0);
  });

  describe('toArray', () => {
    it('returns an empty array for the empty list', () => {
      // Act and Assert
      expect(doublyLinkedList.toArray()).toEqual([]);
      expect(doublyLinkedList.head).toBeNull();
      expect(doublyLinkedList.tail).toBeNull();
      expect(doublyLinkedList.length).toBe(0);
    });
  });

  describe('toString', () => {
    it('returns an empty string for the empty list', () => {
      // Act and Assert
      expect(doublyLinkedList.toString()).toBe('');
    });
  });

  describe('append', () => {
    it('appends node to the empty list', () => {
      // Arrange
      doublyLinkedList.append(1);

      // Act and Assert
      expect(doublyLinkedList.head?.toString()).toBe('1');
      expect(doublyLinkedList.tail?.toString()).toBe('1');
      expect(doublyLinkedList.length).toBe(1);
    });

    it('appends nodes to the non-empty list', () => {
      // Arrange
      doublyLinkedList.append(1);
      doublyLinkedList.append(2);

      // Act and Assert
      expect(doublyLinkedList.head?.toString()).toBe('1');
      expect(doublyLinkedList.tail?.toString()).toBe('2');
      expect(doublyLinkedList.length).toBe(2);
      expect(doublyLinkedList.toString()).toBe('1,2');
    });

    it('can be used in call chain', () => {
      // Arrange
      doublyLinkedList.append(1).append(2).append(3);

      // Act and Assert
      expect(doublyLinkedList.head?.toString()).toBe('1');
      expect(doublyLinkedList.tail?.toString()).toBe('3');
      expect(doublyLinkedList.toString()).toBe('1,2,3');
      expect(doublyLinkedList.length).toBe(3);
    });
  });
});
