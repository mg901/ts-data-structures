import { describe, expect, it } from 'vitest';
import { BinarySearchTree } from './index';

describe('BinarySearchTree', () => {
  it('creates empty binary search tree', () => {
    // Act
    const bst = new BinarySearchTree();

    // Assert
    expect(bst).toBeDefined();
    expect(bst.root.data).toBeNull();
    expect(bst.root.left).toBeNull();
    expect(bst.root.right).toBeNull();
  });

  describe('insert', () => {
    it('adds element to the tree correctly', () => {
      // Arrange
      const bst = new BinarySearchTree<number>();

      // Act
      bst.insert(10);
      bst.insert(5);
      bst.insert(15);

      // Assert
      expect(bst.root.data).toBe(10);
      expect(bst.root.left?.data).toBe(5);
      expect(bst.root.right?.data).toBe(15);
    });

    it('adds object values', () => {
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

      const bst = new BinarySearchTree<Payload>(compareFunction);

      // Act
      bst.insert({ key: 'two', value: 2 });
      bst.insert({ key: 'one', value: 1 });

      bst.insert({ key: 'three', value: 3 });

      // Assert
      expect(bst.root.data.value).toBe(2);
      expect(bst.root.left?.data.value).toBe(1);
      expect(bst.root.right?.data.value).toBe(3);
    });
  });
});
