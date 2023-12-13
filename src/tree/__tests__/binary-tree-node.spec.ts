import { describe, it, expect } from 'vitest';
import { BinaryTreeNode } from '../binary-tree-node';

describe('BinaryTreeNode', () => {
  it('creates a binary tree node with the given value', () => {
    // Act
    const bstNode = new BinaryTreeNode(10);
    // Assert
    expect(bstNode.value).toBe(10);
    expect(bstNode.left).toBeNull();
    expect(bstNode.right).toBeNull();
  });

  describe('setLeft', () => {
    it('sets left child correctly', () => {
      // Arrange
      let rootNode = new BinaryTreeNode(10);
      const leftChild = new BinaryTreeNode(5);
      // Act
      rootNode.setLeft(leftChild);
      // Assert
      expect(rootNode.left).toEqual(leftChild);
    });
  });

  describe('setRight', () => {
    it('sets right child correctly', () => {
      // Arrange
      let rootNode = new BinaryTreeNode(10);
      const rightChild = new BinaryTreeNode(15);
      // Act
      rootNode.setRight(rightChild);
      // Assert
      expect(rootNode.right).toEqual(rightChild);
    });
  });
});
