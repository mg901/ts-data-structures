import { describe, it, expect, beforeEach } from 'vitest';
import { BinaryTreeNode } from '../binary-tree-node';

describe('BinaryTreeNode', () => {
  let parent: BinaryTreeNode<number>;

  // Arrange
  beforeEach(() => {
    parent = new BinaryTreeNode(10);
  });

  it('returns the initial state of the binary tree node correctly', () => {
    // Assert
    expect(parent.value).toBe(10);
    expect(parent.left).toBeNull();
    expect(parent.right).toBeNull();
    expect(parent.parent).toBeNull();
  });

  describe('height', () => {
    it('returns 0 for the parent node', () => {
      // Act and Assert
      expect(parent.height).toBe(0);
    });

    it('returns height of 1 for the node with left and right children', () => {
      // Arrange
      const leftChild = new BinaryTreeNode(5);
      const rightChild = new BinaryTreeNode(15);

      parent.setLeft(leftChild);
      parent.setRight(rightChild);

      // Act and Assert
      expect(parent.height).toBe(1);
    });
  });

  describe('setValue', () => {
    it('replaces the initial value correctly for the initial method', () => {
      // Act
      parent.setValue(20);

      // Assert
      expect(parent.value).toBe(20);
    });
  });

  describe('setLeft', () => {
    it('sets left child and parent correctly', () => {
      // Arrange
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

  describe('leftHeight', () => {
    it('returns 0 for a node with no left child', () => {
      // Act and Assert
      expect(parent.leftHeight).toBe(0);
    });

    it('returns 2 for a node with left child and its left child', () => {
      // Arrange
      const leftChild = new BinaryTreeNode(5);
      parent.setLeft(leftChild);

      const leftLeftChild = new BinaryTreeNode(1);
      leftChild.setLeft(leftLeftChild);

      // Act and Assert
      expect(parent.leftHeight).toBe(2);
    });
  });

  describe('rightHeight', () => {
    it('returns 0 for a node with no right child', () => {
      // Act and Assert
      expect(parent.rightHeight).toBe(0);
    });

    it('returns 2 for a node with right child and its right child', () => {
      // Arrange
      const rightChild = new BinaryTreeNode(15);
      parent.setRight(rightChild);

      const rightRightChild = new BinaryTreeNode(20);
      rightChild.setRight(rightRightChild);

      // Act and Assert
      expect(parent.rightHeight).toBe(2);
    });
  });

  describe('balanceFactor', () => {
    it('returns 0 for a node with no children', () => {
      // Act and Assert
      expect(parent.balanceFactor).toBe(0);
    });

    it('returns positive value for a node with a left child', () => {
      // Arrange
      const leftChild = new BinaryTreeNode(5);
      parent.setLeft(leftChild);

      // Act and Assert
      expect(parent.balanceFactor).toBe(1);
    });

    it('returns negative value for a node with a right child', () => {
      // Arrange
      const rightChild = new BinaryTreeNode(15);
      parent.setRight(rightChild);

      // Act and Assert
      expect(parent.balanceFactor).toBe(-1);
    });

    it('returns correct balance factor for a more complex tree', () => {
      // Arrange
      const leftChild = new BinaryTreeNode(7);
      parent.setLeft(leftChild);

      const rightChild = new BinaryTreeNode(15);
      parent.setRight(rightChild);

      const rightRightChild = new BinaryTreeNode(20);
      rightChild.setRight(rightRightChild);

      // Act and Assert
      expect(parent.balanceFactor).toBe(-1);
    });
  });

  describe('removeNode', () => {
    it('removes children correctly', () => {
      // Arrange
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

  describe('replaceChild', () => {
    it('replaces left child correctly', () => {
      // Arrange
      const oldChild = new BinaryTreeNode(5);
      const newChild = new BinaryTreeNode(8);
      parent.setLeft(oldChild);

      // Act
      parent.replaceChild(oldChild, newChild);

      // Assert
      expect(parent.left).toEqual(newChild);
      expect(oldChild.parent).toBeNull();
      expect(newChild.parent).toEqual(parent);
    });

    it('replaces right child correctly', () => {
      // Arrange
      const oldChild = new BinaryTreeNode(15);
      const newChild = new BinaryTreeNode(20);
      parent.setRight(oldChild);

      // Act
      parent.replaceChild(oldChild, newChild);

      // Assert
      expect(parent.right).toEqual(newChild);
      expect(oldChild.parent).toBeNull();
      expect(newChild.parent).toEqual(parent);
    });
  });

  describe('traverseInOrder', () => {
    it('traverses in order correctly', () => {
      // Arrange
      const leftChild = new BinaryTreeNode(5);
      const rightChild = new BinaryTreeNode(15);

      parent.setLeft(leftChild);
      parent.setRight(rightChild);

      const expected = [5, 10, 15];

      // Act
      const received = parent.traverseInOrder();

      // Assert
      expect(received).toEqual(expected);
    });
  });

  describe('toString', () => {
    it('returns string representation of the tree in in-order traversal', () => {
      // Arrange
      const leftChild = new BinaryTreeNode(5);
      const rightChild = new BinaryTreeNode(15);
      const leftLeftChild = new BinaryTreeNode(3);
      const leftRightChild = new BinaryTreeNode(7);

      parent.setLeft(leftChild);
      parent.setRight(rightChild);
      leftChild.setLeft(leftLeftChild);
      leftChild.setRight(leftRightChild);

      // Act and Assert
      expect(parent.toString()).toBe('3,5,7,10,15');
    });
  });
});
