import { beforeEach, describe, expect, it } from 'vitest';
import { SinglyLinkedListNode } from './index';

describe('LinkedListNode', () => {
  let node: SinglyLinkedListNode<number>;

  // Arrange
  beforeEach(() => {
    node = new SinglyLinkedListNode<number>(1);
  });

  it('creates initial state correctly', () => {
    // Assert
    expect(node).toBeDefined();
    expect(node.data).toEqual(1);
    expect(node.next).toBeNull();
  });

  it('links nodes together', () => {
    // Act
    const node0 = new SinglyLinkedListNode<number>(0, node);

    // Assert
    expect(node0.next).toBeDefined();
    expect(node.next).toBeNull();
    expect(node0.data).toEqual(0);
    expect(node0.next?.data).toEqual(1);
  });
});
