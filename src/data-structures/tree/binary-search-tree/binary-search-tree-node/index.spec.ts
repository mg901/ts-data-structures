import { describe, expect, it } from 'vitest';
import { BinarySearchTreeNode } from './index';

describe('BinarySearchTreeNode', () => {
  it('returns initial state correctly', () => {
    // Arrange
    const node = new BinarySearchTreeNode(1);

    // Assert
    expect(node).toBeDefined();
  });
});
