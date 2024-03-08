import { beforeEach, describe, expect, it } from 'vitest';
import { BinaryTreeNode } from './index';

describe('BinaryTreeNode', () => {
  let node1: BinaryTreeNode<number>;
  let node2: BinaryTreeNode<number>;
  let node3: BinaryTreeNode<number>;

  // Arrange
  beforeEach(() => {
    node1 = new BinaryTreeNode(1);
    node2 = new BinaryTreeNode(2);
    node3 = new BinaryTreeNode(3);
  });

  it('returns initial state correctly', () => {
    // Arrange
    const node = new BinaryTreeNode(1);

    // Act and Assert
    expect(node).toBeDefined();

    expect(node.data).toBe(1);
    expect(node.parent).toBeNull();
    expect(node.left).toBeNull();
    expect(node.right).toBeNull();
  });

  describe('setLeft', () => {
    it('sets left child node correctly', () => {
      // Act
      node1.setLeft(node2);

      // Assert
      expect(node1.left).toEqual(node2);
      expect(node2.parent).toEqual(node1);
    });

    it('disconnects the existing left child node before setting a new one', () => {
      // Arrange
      const oldLeft = node3;
      node1.setLeft(oldLeft);

      // Act
      const newLeft = new BinaryTreeNode(4);
      node1.setLeft(newLeft);

      // Assert
      expect(node1.left).toEqual(newLeft);
      expect(newLeft.parent).toEqual(node1);
      expect(oldLeft.parent).toBeNull();
    });
  });

  describe('setRight', () => {
    it('sets right child node correctly', () => {
      // Act
      node1.setRight(node2);

      // Assert

      expect(node1.right).toEqual(node2);
      expect(node2.parent).toEqual(node1);
    });

    it('disconnects existing right child node before setting new one', () => {
      // Arrange
      const oldRight = node3;
      node1.setRight(oldRight);

      // Act
      const newRight = new BinaryTreeNode(4);
      node1.setRight(newRight);

      // Assert
      expect(node1.right).toEqual(newRight);
      expect(newRight.parent).toEqual(node1);
      expect(oldRight.parent).toBeNull();
    });
  });
});
