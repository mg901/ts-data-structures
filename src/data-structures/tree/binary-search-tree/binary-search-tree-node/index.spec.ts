import { describe, expect, it } from 'vitest';
import { BinarySearchTreeNode } from './index';

describe('BinarySearchTreeNode', () => {
  it('returns initial state correctly', () => {
    // Arrange
    const node = new BinarySearchTreeNode(1);

    // Assert
    expect(node).toBeDefined();
    // Assert
    expect(node.data).toBe(1);
    expect(node.left).toBeNull();
    expect(node.right).toBeNull();
  });

  describe('insert', () => {
    it('inserts smaller values to the left', () => {
      // Arrange
      const root = new BinarySearchTreeNode(20);

      // Act
      root.insert(3);
      root.insert(25);
      root.insert(2);

      // Assert
      expect(root.data).toBe(20);
      expect(root.left?.data).toBe(3);
      expect(root.left?.left?.data).toBe(2);
      expect(root.right?.data).toBe(25);
    });
  });

  describe('find', () => {
    it('finds node by the value correctly', () => {
      // Arrange
      const root = new BinarySearchTreeNode(2);
      const leftNode = new BinarySearchTreeNode(1);
      const rightNode = new BinarySearchTreeNode(4);

      root.setLeft(leftNode);
      root.setRight(rightNode);

      // Act and Assert
      expect(root.find(4)).toEqual(rightNode);
      expect(root.find(10)).toBeNull();
    });
  });

  describe('contains', () => {
    it('checks if there is a node is the tree by value', () => {
      // Arrange
      const root = new BinarySearchTreeNode(4);
      const leftNode = new BinarySearchTreeNode(2);
      const rightNode = new BinarySearchTreeNode(6);

      root.setLeft(leftNode);
      root.setRight(rightNode);

      // Act and Assert
      expect(root.contains(2)).toBeTruthy();
      expect(root.contains(10)).toBeFalsy();
    });
  });

  describe('delete', () => {
    it('deletes leaf node correctly', () => {
      // Arrange
      const root = new BinarySearchTreeNode(5);

      root.insert(3);
      root.insert(6);
      root.insert(2);
      root.insert(4);
      root.insert(7);

      // Act
      // expect(root.delete(7)).toBeTruthy();
    });
  });

  describe('findMin', () => {
    it('returns the node with the minimum value', () => {
      // Arrange
      const root = new BinarySearchTreeNode(20);

      root.insert(15);
      root.insert(25);
      root.insert(10);
      root.insert(30);

      // Act and Assert
      expect(root.findMin().data).toEqual(10);
    });
  });
});
