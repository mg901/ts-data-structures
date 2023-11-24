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
      expect(doublyLinkedList.toArray()).toEqual([]);
      expect(doublyLinkedList.head).toBeNull();
      expect(doublyLinkedList.tail).toBeNull();
      expect(doublyLinkedList.length).toBe(0);
    });
  });
});
