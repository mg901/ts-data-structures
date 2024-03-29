import { describe, expect, it } from 'vitest';
import { DoublyLinkedListNode } from './index';

describe('DoublyLinkedListNode', () => {
  it('creates list node with value', () => {
    // Act
    const doublyList = new DoublyLinkedListNode<number>(1);

    // Assert
    expect(doublyList.prev).toBeNull();
  });

  it('links node together', () => {
    // Arrange
    const node2 = new DoublyLinkedListNode<number>(2);

    // Act
    const node1 = new DoublyLinkedListNode<number>(1, node2);

    // Act
    const node3 = new DoublyLinkedListNode<number>(3, node1, node2);

    // Assert
    expect(node1.data).toBe(1);
    expect(node1.next?.data).toBe(2);
    expect(node1.next?.next).toBeNull();
    expect(node1.prev).toBeNull();

    expect(node2.next).toBeNull();
    expect(node2.prev).toBeNull();

    expect(node3.next?.data).toBe(1);
    expect(node3.prev?.data).toBe(2);
  });
});
