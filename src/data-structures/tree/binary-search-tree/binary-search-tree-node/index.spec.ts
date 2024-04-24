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
    it('returns false when deleting a non-existing node', () => {
      // Arrange
      const root = new BinarySearchTreeNode(5);

      // Act and Assert
      expect(root.delete(10)).toBeFalsy();
    });

    it('deletes leaf node', () => {
      // Arrange
      const root = new BinarySearchTreeNode(10);

      root.insert(5);

      expect(root.find(5)).toBeDefined();

      // Act and Assert
      expect(root.delete(5)).toBeTruthy();
      expect(root.find(5)).toBeNull();
    });

    it('deletes a node with one child', () => {
      // Arrange
      const root = new BinarySearchTreeNode(10);
      root.insert(5).insert(2);

      expect(root.find(5)).toBeDefined();

      // Act and Assert
      expect(root.delete(5)).toBeTruthy();
      expect(root.find(5)).toBeNull();
      expect(root.left?.data).toBe(2);
    });

    it('deletes a node with two children', () => {
      const root = new BinarySearchTreeNode(12);

      root.insert(5);
      root.insert(3);
      root.insert(7);
      root.insert(1);
      root.insert(9);
      root.insert(8);
      root.insert(11);

      root.insert(15);
      root.insert(17);
      root.insert(13);
      root.insert(20);
      root.insert(14);
      root.insert(18);

      expect(root.find(15)).toBeDefined();

      // Act and Assert
      expect(root.delete(15)).toBeTruthy();
      expect(root.find(15)).toBeNull();

      expect(root.right?.data).toBe(17);
      expect(root.right?.left?.data).toBe(13);
      expect(root.right?.right?.data).toBe(20);
    });
  });

  describe('findMin', () => {
    it('returns a node with the minimum value', () => {
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

  describe('findMax', () => {
    it('returns a node with the maximum value', () => {
      // Arrange
      const root = new BinarySearchTreeNode(30);

      root.insert(25);
      root.insert(20);
      root.insert(35);
      root.insert(40);

      // Act
      const maxNode = root.findMax();

      // Assert
      expect(maxNode.data).toBe(40);
    });
  });
});
