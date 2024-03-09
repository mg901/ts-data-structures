import { beforeEach, describe, expect, it } from 'vitest';
import { LinkedListNode } from './index';

describe('LinkedListNode', () => {
  let node: LinkedListNode<number>;

  // Arrange
  beforeEach(() => {
    node = new LinkedListNode<number>(1);
  });

  it('creates initial state correctly', () => {
    // Assert
    expect(node).toBeDefined();
    expect(node.data).toEqual(1);
    expect(node.next).toBeNull();
  });

  it('links nodes together', () => {
    // Act
    const node0 = new LinkedListNode<number>(0, node);

    // Assert
    expect(node0.next).toBeDefined();
    expect(node.next).toBeNull();
    expect(node0.data).toEqual(0);
    expect(node0.next?.data).toEqual(1);
  });
});
