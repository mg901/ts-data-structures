import { describe, expect, it } from 'vitest';
import { BinaryTreeNode } from './binary-tree-node';

describe('BinaryTreeNode', () => {
  it('returns initial state correctly', () => {
    // Arrange
    const node = new BinaryTreeNode(1);

    // Act and Assert
    expect(node).toBeDefined();
    expect(node.data).toBe(1);
    expect(node.left).toBeNull();
    expect(node.right).toBeNull();
  });

  it('links nodes together', () => {
    // Arrange
    const leftChild = new BinaryTreeNode(2);
    const rightChild = new BinaryTreeNode(3);

    const root = new BinaryTreeNode(1, leftChild, rightChild);

    // Assert
    expect(root.data).toBe(1);
    expect(root.left?.data).toEqual(leftChild.data);
    expect(root.right?.data).toEqual(rightChild.data);
  });
});
