import { beforeEach, describe, expect, it } from 'vitest';
import { BinaryTree } from './index';

describe('BinaryTree', () => {
  let binaryTree: BinaryTree<number>;

  // Arrange
  beforeEach(() => {
    binaryTree = new BinaryTree();
  });

  it('returns initial state correctly', () => {
    // Assert
    expect(binaryTree).toBeDefined();
  });

  describe('insert', () => {
    it('inserts a value as the root node if the tree is empty', () => {
      // Act
      binaryTree.insert(10);

      // Assert
      expect(binaryTree.root?.data).toBe(10);
      expect(binaryTree.root?.left).toBeNull();
      expect(binaryTree.root?.right).toBeNull();
    });

    it('inserts a value as a left child of the root node if the value is less than the root value', () => {
      // Arrange
      binaryTree.insert(10);

      // Act
      binaryTree.insert(5);

      // Arrange
      expect(binaryTree.root?.left?.data).toBe(5);
      expect(binaryTree.root?.right).toBeNull();
    });

    it('insets a value as a left child of the root node if the value is equal to the root value', () => {
      // Arrange
      binaryTree.insert(10);

      // Act
      binaryTree.insert(10);

      // Arrange
      expect(binaryTree.root?.left?.data).toBe(10);
      expect(binaryTree.root?.right).toBeNull();
    });

    it("inserts the value recursively to the left subtree if it is less than the current node's value", () => {
      // Arrange
      binaryTree.insert(10);
      binaryTree.insert(7);

      // Act
      binaryTree.insert(5);
      expect(binaryTree.root?.left?.left?.data).toBe(5);
    });

    it("inserts the value recursively to the left subtree if it is equal to the current node's value", () => {
      // Arrange
      binaryTree.insert(10);
      binaryTree.insert(7);

      // Act
      binaryTree.insert(7);
      expect(binaryTree.root?.left?.left?.data).toBe(7);
    });

    it('insets a value as a right child of the root node if the value is greater than the root value', () => {
      // Arrange
      binaryTree.insert(10);

      // Act
      binaryTree.insert(15);

      // Assert
      expect(binaryTree.root?.right?.data).toBe(15);
      expect(binaryTree.root?.left).toBeNull();
    });

    it("insets the values recursively to the right subtree if the value is greater than the current node's value", () => {
      // Arrange
      binaryTree.insert(10);
      binaryTree.insert(15);

      // Act
      binaryTree.insert(20);

      // Assert
      expect(binaryTree.root?.right?.right?.data).toBe(20);
    });
  });
});
