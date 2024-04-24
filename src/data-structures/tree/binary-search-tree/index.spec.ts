import { beforeEach, describe, expect, it } from 'vitest';
import { BinarySearchTree } from './index';

describe('BinarySearchTree', () => {
  let bst: BinarySearchTree<number>;

  beforeEach(() => {
    bst = new BinarySearchTree();
  });
  it('creates empty binary search tree', () => {
    // Act

    // Assert
    expect(bst).toBeDefined();
    expect(bst.root.data).toBeNull();
    expect(bst.root.left).toBeNull();
    expect(bst.root.right).toBeNull();
  });

  describe('insert', () => {
    it('adds element to a tree', () => {
      // Act
      bst.insert(10);
      bst.insert(5);
      bst.insert(15);

      // Assert
      expect(bst.root.data).toBe(10);
      expect(bst.root.left?.data).toBe(5);
      expect(bst.root.right?.data).toBe(15);
    });

    it('adds object values to a tree', () => {
      type Payload = {
        key: string;
        value: number;
      };

      const compareFunction = <T extends Payload>(a: T, b: T) => {
        const normalizedA = a ?? { value: null };
        const normalizedB = b ?? { value: null };

        if (normalizedA.value === normalizedB.value) {
          return 0;
        }

        return normalizedA.value > normalizedB.value ? 1 : -1;
      };

      const binarySearchTree = new BinarySearchTree<Payload>(compareFunction);

      // Act
      binarySearchTree.insert({ key: 'two', value: 2 });
      binarySearchTree.insert({ key: 'one', value: 1 });

      binarySearchTree.insert({ key: 'three', value: 3 });

      // Assert
      expect(binarySearchTree.root.data.value).toBe(2);
      expect(binarySearchTree.root.left?.data.value).toBe(1);
      expect(binarySearchTree.root.right?.data.value).toBe(3);
    });
  });

  describe('find', () => {
    it('finds node by value', () => {
      // Arrange

      bst.insert(10);
      bst.insert(5);
      bst.insert(15);

      // Act and assert
      expect(bst.find(15)?.data).toBe(15);
      expect(bst.find(30)).toBeNull();
    });
  });

  describe('contains', () => {
    it('checks if there is a node in a tree', () => {
      // Arrange
      bst.insert(10);

      // Act and Assert
      expect(bst.contains(10)).toBeTruthy();
      expect(bst.contains(30)).toBeFalsy();
    });
  });

  describe('delete', () => {
    it('returns false when deleting a non-existing node', () => {
      // Arrange
      bst.insert(5);

      // Act and Assert
      expect(bst.delete(10)).toBeFalsy();
    });

    it('deletes leaf node', () => {
      // Arrange
      bst.insert(10);
      bst.insert(5);

      expect(bst.find(5)).toBeDefined();

      // Act and Assert
      expect(bst.delete(5)).toBeTruthy();
      expect(bst.find(5)).toBeNull();
    });

    it('deletes a node with one child', () => {
      // Arrange
      bst.insert(10);
      bst.insert(5);
      bst.insert(2);

      expect(bst.find(5)).toBeDefined();

      // Act and Assert
      expect(bst.delete(5)).toBeTruthy();
      expect(bst.find(5)).toBeNull();
      expect(bst.root.left?.data).toBe(2);
    });

    it('deletes a node with two children', () => {
      // Arrange
      bst.insert(12);
      bst.insert(5);
      bst.insert(3);
      bst.insert(7);
      bst.insert(1);
      bst.insert(9);
      bst.insert(8);
      bst.insert(11);

      bst.insert(15);
      bst.insert(17);
      bst.insert(13);
      bst.insert(20);
      bst.insert(14);
      bst.insert(18);

      expect(bst.find(15)).toBeDefined();

      // Act and Assert
      expect(bst.delete(15)).toBeTruthy();
      expect(bst.find(15)).toBeNull();

      expect(bst.root.right?.data).toBe(17);
      expect(bst.root.right?.left?.data).toBe(13);
      expect(bst.root.right?.right?.data).toBe(20);
    });
  });

  describe('findMin', () => {
    it('returns a node with the minimum value', () => {
      // Arrange
      bst.insert(20);
      bst.insert(15);
      bst.insert(25);
      bst.insert(10);
      bst.insert(30);

      // Act and Assert
      expect(bst.findMin().data).toEqual(10);
    });
  });

  describe('findMax', () => {
    it('returns a node with the maximum value', () => {
      // Arrange
      bst.insert(30);
      bst.insert(25);
      bst.insert(20);
      bst.insert(35);
      bst.insert(40);

      // Act
      const maxNode = bst.findMax();

      // Assert
      expect(maxNode.data).toBe(40);
    });
  });
});
