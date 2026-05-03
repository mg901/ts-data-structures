import { beforeEach, describe, expect, it } from 'vitest';
import { MinHeap } from './index';

describe('MinHeap', () => {
  it('creates an empty heap', () => {
    // Act
    const minHeap = new MinHeap();

    // Assert
    expect(minHeap).toBeDefined();
    expect(minHeap.toArray()).toEqual([]);
    expect(minHeap.toString()).toEqual('');
    expect(minHeap.size).toBe(0);
    expect(minHeap.isEmpty).toBeTruthy();
  });

  describe('insert', () => {
    it('adds items to the heap', () => {
      // Arrange
      const minHeap = new MinHeap<number>();

      // Act
      minHeap.insert(10).insert(1).insert(3).insert(5);

      // Assert
      expect(minHeap.peek()).toBe(1);
      expect(minHeap.size).toBe(4);
      expect(minHeap.isEmpty).toBeFalsy();
      expect(Array.from(minHeap)).toEqual([1, 3, 5, 10]);
    });
  });

  describe('of', () => {
    it('creates the new heap with a single element', () => {
      // Act
      const minHeap = MinHeap.of(1);

      // Assert
      expect(minHeap.size).toBe(1);
      expect(minHeap.isEmpty).toBeFalsy();
      expect(Array.from(minHeap)).toEqual([1]);
    });
  });

  describe('poll', () => {
    it('tries to remove a non-existing element', () => {
      // Arrange
      const minHeap = new MinHeap();

      // Act and Assert
      expect(minHeap.poll()).toBeNull();
    });

    it('removes the top element from the heap with a single element', () => {
      // Arrange
      const minHeap = MinHeap.of(10);

      // Act and Assert
      expect(minHeap.poll()).toBe(10);
      expect(minHeap.isEmpty).toBeTruthy();
    });

    it('removes the top element from the heap', () => {
      // Arrange
      const minHeap = MinHeap.of(1).insert(5).insert(3).insert(8).insert(2);

      // Act and Assert
      expect(minHeap.poll()).toBe(1);
      expect(minHeap.size).toBe(4);
      expect(Array.from(minHeap)).toEqual([2, 3, 5, 8]);
    });
  });

  describe('remove', () => {
    // Arrange
    let minHeap: MinHeap<number>;

    beforeEach(() => {
      minHeap = MinHeap.of(12).insert(8).insert(7).insert(3).insert(5);
    });

    it('tries to remove a non-existing element', () => {
      // Act
      const removedValue = minHeap.remove((x) => x === 4);

      // Assert
      expect(removedValue).toBeNull();
      expect(minHeap.size).toBe(5);
      expect(Array.from(minHeap)).toEqual([3, 5, 7, 8, 12]);
    });

    it('removes the last element', () => {
      // Act
      const removedElement = minHeap.remove((x) => x === 7);

      // Assert
      expect(removedElement).toBe(7);
      expect(minHeap.size).toBe(4);
      expect(Array.from(minHeap)).toEqual([3, 5, 8, 12]);
    });

    it('removes an arbitrary element', () => {
      // Act
      const deletedValue = minHeap.remove((x) => x === 5);

      // Assert
      expect(deletedValue).toBe(5);
      expect(minHeap.size).toBe(4);
      expect(Array.from(minHeap)).toEqual([3, 7, 8, 12]);
    });

    it('removes the top element', () => {
      // Act and Assert
      expect(minHeap.remove((x) => x === 3)).toBe(3);
      expect(minHeap.peek()).toBe(5);
      expect(Array.from(minHeap)).toEqual([5, 7, 8, 12]);
    });
  });

  describe('Symbol.Iterator', () => {
    it('should yield elements in ascending order', () => {
      const minHeap = MinHeap.fromArray([5, 2, 8, 1]);

      expect(Array.from(minHeap)).toEqual([1, 2, 5, 8]);
    });
  });

  describe('clear', () => {
    it('clears the heap', () => {
      // Arrange
      const minHeap = MinHeap.of(3).insert(5).insert(1);

      // Act
      minHeap.clear();

      // Assert
      expect(minHeap.isEmpty).toBeTruthy();
      expect(minHeap.size).toBe(0);
      expect(minHeap.toArray()).toEqual([]);
    });
  });
});
