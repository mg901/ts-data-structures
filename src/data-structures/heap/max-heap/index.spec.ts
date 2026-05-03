import { beforeEach, describe, expect, it } from 'vitest';
import { MaxHeap } from './index';

describe('MaxHeap', () => {
  it('creates an empty heap', () => {
    // Act
    const maxHeap = new MaxHeap();
    // Assert
    expect(maxHeap).toBeDefined();
    expect(maxHeap.toArray()).toEqual([]);
    expect(maxHeap.toString()).toEqual('');
    expect(maxHeap.size).toBe(0);
    expect(maxHeap.isEmpty).toBeTruthy();
  });

  describe('insert', () => {
    it('adds items to the heap', () => {
      // Arrange
      const minHeap = new MaxHeap<number>();

      // Act
      minHeap.insert(3).insert(1).insert(10).insert(5);

      // Assert
      expect(minHeap.peek()).toBe(10);
      expect(minHeap.size).toBe(4);
      expect(minHeap.isEmpty).toBeFalsy();
      expect(Array.from(minHeap)).toEqual([10, 5, 3, 1]);
    });
  });

  describe('of', () => {
    it('creates the new heap with a single element', () => {
      // Act
      const newMaxHeap = MaxHeap.of(1);

      // Assert
      expect(newMaxHeap.toArray()).toEqual([1]);
      expect(newMaxHeap.size).toBe(1);
      expect(newMaxHeap.isEmpty).toBeFalsy();
    });
  });

  describe('poll', () => {
    it('tries to remove a non-existing element', () => {
      // Arrange
      const maxHeap = new MaxHeap();

      // Act and Assert
      expect(maxHeap.poll()).toBeNull();
    });

    it('removes the top element from the heap with a single element', () => {
      const maxHeap = MaxHeap.of(10);

      // Act and Assert
      expect(maxHeap.poll()).toBe(10);
      expect(maxHeap.isEmpty).toBeTruthy();
    });

    it('removes the top element from the heap', () => {
      // Arrange
      const minHeap = MaxHeap.of(1).insert(5).insert(3).insert(8).insert(2);

      // Act and Assert
      expect(minHeap.poll()).toBe(8);
      expect(minHeap.size).toBe(4);
      expect(Array.from(minHeap)).toEqual([5, 3, 2, 1]);
    });
  });

  describe('remove', () => {
    // Arrange
    let maxHeap: MaxHeap<number>;

    beforeEach(() => {
      maxHeap = MaxHeap.of(12).insert(8).insert(7).insert(3).insert(5);
    });

    it('tries to remove a non-existing element', () => {
      // Act
      const removedValue = maxHeap.remove((x) => x === 4);

      // Assert
      expect(removedValue).toBeNull();
      expect(maxHeap.size).toBe(5);
      expect(Array.from(maxHeap)).toEqual([12, 8, 7, 5, 3]);
    });

    it('removes the last element', () => {
      // Act
      const deletedElement = maxHeap.remove((x) => x === 5);

      // Assert
      expect(deletedElement).toBe(5);
      expect(maxHeap.size).toBe(4);
      expect(Array.from(maxHeap)).toEqual([12, 8, 7, 3]);
    });

    it('removes an arbitrary element', () => {
      // Act
      const removedValue = maxHeap.remove((x) => x === 8);

      // Assert
      expect(removedValue).toBe(8);
      expect(maxHeap.size).toBe(4);
      expect(Array.from(maxHeap)).toEqual([12, 7, 5, 3]);
    });

    it('removes the top element', () => {
      // Act
      const deletedElement = maxHeap.remove((x) => x === 12);

      // Assert
      expect(deletedElement).toBe(12);
      expect(maxHeap.peek()).toBe(8);
      expect(Array.from(maxHeap)).toEqual([8, 7, 5, 3]);
    });
  });

  describe('Symbol.Iterator', () => {
    it('should yield elements in descending order', () => {
      const maxHeap = MaxHeap.fromArray([1, 2, 5, 8]);

      expect(Array.from(maxHeap)).toEqual([8, 5, 2, 1]);
    });
  });

  describe('clear', () => {
    it('clears the heap', () => {
      // Arrange
      const maxHeap = MaxHeap.of(3).insert(5).insert(1);

      // Act
      maxHeap.clear();

      // Assert
      expect(maxHeap.isEmpty).toBeTruthy();
    });
  });
});
