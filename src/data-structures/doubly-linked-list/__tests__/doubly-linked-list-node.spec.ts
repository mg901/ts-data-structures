import { describe, it, expect } from 'vitest';
import { DoublyLinkedListNode } from '../doubly-linked-list-node';

describe('DoublyLinkedListNode', () => {
  it('creates list node with value', () => {
    // Act
    const doublyList = new DoublyLinkedListNode<number>(1);

    // Assert
    expect(doublyList.data).toBe(1);
    expect(doublyList.next).toBeNull();
    expect(doublyList.prev).toBeNull();
  });

  it('creates list node with object with value', () => {
    // Arrange
    const expectedValue = {
      value: 1,
      key: 'test',
    };

    // Act
    const list = new DoublyLinkedListNode<typeof expectedValue>(expectedValue);

    // Assert
    expect(list.data).toEqual(expectedValue);
    expect(list.next).toBeNull();
    expect(list.prev).toBeNull();
  });

  it('links node together', () => {
    // Arrange
    const node3 = new DoublyLinkedListNode<number>(3);

    // Act
    const node2 = new DoublyLinkedListNode<number>(2, node3);

    // Act
    const node1 = new DoublyLinkedListNode<number>(1, node2, node3);

    // Assert
    expect(node1.data).toBe(1);
    expect(node1.next?.data).toBe(2);
    expect(node1.next?.next?.data).toBe(3);
    expect(node1.next?.next?.next).toBeNull();
  });
});
