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

    it('rewrites previous parent node', () => {
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

  describe('height', () => {
    it('returns height of single node', () => {
      expect(node1.height).toBe(0);
    });

    it('calculates node height', () => {
      // Arrange
      const root = new BinaryTreeNode(1);
      const left = new BinaryTreeNode(2);
      const right = new BinaryTreeNode(3);
      const grandLeft = new BinaryTreeNode(4);
      const grandRight = new BinaryTreeNode(5);
      const grandGrandLeft = new BinaryTreeNode(6);

      expect(root.height).toBe(0);

      // Act
      root.setLeft(left);
      root.setRight(right);

      // Assert
      expect(root.height).toBe(1);
      expect(left.height).toBe(0);
      expect(root.balanceFactor).toBe(0);

      // Act
      left.setLeft(grandLeft);
      left.setRight(grandRight);

      // Assert
      expect(root.height).toBe(2);
      expect(left.height).toBe(1);
      expect(grandLeft.height).toBe(0);
      expect(grandRight.height).toBe(0);
      expect(root.balanceFactor).toBe(1);

      // Act
      grandLeft.setLeft(grandGrandLeft);

      // Assert
      expect(root.height).toBe(3);
      expect(left.height).toBe(2);
      expect(grandLeft.height).toBe(1);
      expect(grandRight.height).toBe(0);
      expect(grandGrandLeft.height).toBe(0);
      expect(root.balanceFactor).toBe(2);
    });
  });

  describe('deleteChild', () => {
    it('removes the left child correctly', () => {
      // Arrange
      const root = node1;
      root.setLeft(node2);
      root.setRight(node3);

      // Act
      root.deleteChild(node2);

      // Assert
      expect(root.left).toBeNull();
      expect(root.right).toEqual(node3);
    });

    it('removes the right child correctly', () => {
      // Arrange
      const root = node1;
      root.setLeft(node2);
      root.setRight(node3);

      // Act and Assert
      expect(root.deleteChild(node3)).toBeTruthy();
      expect(root.left).toEqual(node2);
      expect(root.right).toBeNull();
    });

    it('returns false for non-existing node', () => {
      // Arrange
      const root = node1;
      root.setLeft(node2);

      // Act and Assert
      expect(root.deleteChild(node3)).toBeFalsy();
    });
  });

  describe('DFS traversal', () => {
    let root: BinaryTreeNode<number>;

    beforeEach(() => {
      root = new BinaryTreeNode(2);
      root.setLeft(new BinaryTreeNode(1));
      root.setRight(new BinaryTreeNode(3));
    });

    it('inOrder traversal', () => {
      // Act
      const result = root.dfsTraversal('inOrder');

      // Assert
      expect(result).toEqual([1, 2, 3]);
    });

    it('preOrder traversal', () => {
      // Act
      const result = root.dfsTraversal('preOrder');

      // Assert
      expect(result).toEqual([2, 1, 3]);
    });

    it('postOrder traversal', () => {
      // Act
      const result = root.dfsTraversal('postOrder');

      // Assert
      expect(result).toEqual([1, 3, 2]);
    });
  });

  describe('BFS traversal', () => {
    it('performs bfs traversal correctly', () => {
      // Arrange
      const root = new BinaryTreeNode(1);

      root.setLeft(new BinaryTreeNode(2));
      root.setRight(new BinaryTreeNode(3));

      root.left?.setLeft(new BinaryTreeNode(4));
      root.right?.setRight(new BinaryTreeNode(5));

      // Act
      const result = root.bfsTraversal();

      // Assert
      expect(result).toEqual([1, 2, 3, 4, 5]);
    });
  });
});
