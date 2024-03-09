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
      const left = root.insert(3);
      const right = root.insert(25);
      const grandLeft = root.insert(2);
      // node.insert(5);

      // Assert
      expect(left?.data).toBe(3);
      expect(right?.data).toBe(25);
      expect(grandLeft?.data).toBe(2);
      // expect(node.left?.left?.data).toBe(2);
      // expect(node.left?.right?.data).toBe(5);
    });
  });
});
