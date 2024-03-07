import { describe, expect, it } from 'vitest';
import { BinaryTree } from './index';

describe('BinaryTree', () => {
  it('returns initial state correctly', () => {
    // Arrange
    const binaryTree = new BinaryTree();

    // Assert
    expect(binaryTree).toBeDefined();
  });

  it('sets the root value', () => {
    // Arrange
    const binaryTree = new BinaryTree<number>();

    // Act
    binaryTree.setRootValue(1);

    // Assert
    expect(binaryTree.root?.data).toBe(1);
  });
});
