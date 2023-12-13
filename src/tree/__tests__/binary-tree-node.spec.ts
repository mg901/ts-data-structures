import { describe, it, expect } from 'vitest';
import { BinaryTreeNode } from '../binary-tree-node';

describe('BinaryTreeNode', () => {
  it('creates a binary tree node with the given value', () => {
    // Act
    const node = new BinaryTreeNode(10);

    // Assert
    expect(node.value).toBe(10);
    expect(node.left).toBeNull();
    expect(node.right).toBeNull();
    expect(node.parent).toBeNull();
  });

  describe('setLeft', () => {
    it('sets left child and parent correctly', () => {
      // Arrange
      const parent = new BinaryTreeNode(10);
      const leftChild1 = new BinaryTreeNode(5);

      // Act
      parent.setLeft(leftChild1);

      // Assert
      expect(parent.value).toBe(10);
      expect(parent.left).toEqual(leftChild1);
      expect(leftChild1.parent).toEqual(parent);

      const leftChild2 = new BinaryTreeNode(3);

      // Act
      parent.setLeft(leftChild2);

      // Assert
      expect(parent.value).toBe(10);
      expect(parent.left).toEqual(leftChild2);
      expect(leftChild1.parent).toBeNull();
      expect(leftChild2.parent).toBe(parent);
    });
  });

  describe('setRight', () => {
    it('sets right child and parent correctly', () => {
      // Arrange
      const parent = new BinaryTreeNode(10);
      const rightChild1 = new BinaryTreeNode(15);

      // Act
      parent.setRight(rightChild1);

      // Assert
      expect(parent.value).toBe(10);
      expect(parent.right).toEqual(rightChild1);
      expect(rightChild1.parent).toEqual(parent);

      const rightChild2 = new BinaryTreeNode(12);

      // Act
      parent.setRight(rightChild2);

      // Assert
      expect(parent.value).toBe(10);
      expect(parent.right).toEqual(rightChild2);
      expect(rightChild1.parent).toBeNull();
      expect(rightChild2.parent).toBe(parent);
    });
  });

  describe('removeNode', () => {
    it('removes child correctly', () => {
      // Arrange
      const parent = new BinaryTreeNode(10);
      const leftChild = new BinaryTreeNode(5);
      const rightChild = new BinaryTreeNode(15);

      parent.setLeft(leftChild);
      parent.setRight(rightChild);

      // Act
      const removedLeft = parent.removeChild(leftChild);
      const removedRight = parent.removeChild(rightChild);

      // Assert
      expect(parent.left).toBeNull();
      expect(parent.right).toBeNull();
      expect(removedLeft).toEqual(removedLeft);
      expect(removedRight).toEqual(removedRight);
      expect(removedLeft?.parent).toBeNull();
      expect(removedRight?.parent).toBeNull();
    });
  });
});
