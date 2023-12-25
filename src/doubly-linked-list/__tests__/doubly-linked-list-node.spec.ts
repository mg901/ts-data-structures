import { describe, it, expect } from 'vitest';
import { DoublyLinkedListNode } from '../doubly-linked-list-node';

describe('DoublyLinkedListNode', () => {
  it('creates list node with value', () => {
    // Act
    const doublyList = new DoublyLinkedListNode<number>(1);

    // Assert
    expect(doublyList.value).toBe(1);
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
    expect(list.value).toEqual(expectedValue);
    expect(list.next).toBeNull();
    expect(list.prev).toBeNull();
  });

  it('links node together', () => {
    // Arrange
    const node2 = new DoublyLinkedListNode<number>(2);

    // Act
    const node1 = new DoublyLinkedListNode<number>(1, node2);

    // Act
    const node3 = new DoublyLinkedListNode<number>(3, node1, node2);

    // Assert
    expect(node1.next).toBeDefined();
    expect(node1.prev).toBeNull();
    expect(node2.next).toBeNull();
    expect(node2.prev).toBeNull();
    expect(node3.next).toBeDefined();
    expect(node3.prev).toBeDefined();
    expect(node1.value).toBe(1);
    expect(node1.next?.value).toBe(2);
    expect(node3.next?.value).toBe(1);
    expect(node3.prev?.value).toBe(2);
  });
});
