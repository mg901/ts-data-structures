import { beforeEach, describe, expect, it } from 'vitest';
import { MaxHeap } from './index';

describe('MaxHeap', () => {
  it('creates an empty MaxHeap', () => {
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
    it('inserts items into the heap and ensures heap property is maintained', () => {
      // Arrange
      const maxHeap = MaxHeap.of(1);

      // Act
      maxHeap.insert(10);
      // Assert
      expect(maxHeap.toArray()).toEqual([10, 1]);
      expect(maxHeap.size).toBe(2);
      expect(maxHeap.isEmpty).toBeFalsy();

      // Act
      maxHeap.insert(3);
      // Assert
      expect(maxHeap.toArray()).toEqual([10, 1, 3]);
      expect(maxHeap.peek()).toBe(10);

      // Act
      maxHeap.insert(5);
      // Assert
      expect(maxHeap.toArray()).toEqual([10, 5, 3, 1]);
      expect(maxHeap.peek()).toBe(10);

      // Act
      maxHeap.insert(8);
      // Assert
      expect(maxHeap.toArray()).toEqual([10, 8, 3, 1, 5]);
      expect(maxHeap.peek()).toBe(10);

      // // Act
      maxHeap.insert(20);
      // Assert
      expect(maxHeap.toArray()).toEqual([20, 8, 10, 1, 5, 3]);
      expect(maxHeap.peek()).toBe(20);
    });
  });

  describe('of', () => {
    it('creates a new heap with a single element', () => {
      // Act
      const newMaxHeap = MaxHeap.of(1);

      // Assert
      expect(newMaxHeap.toArray()).toEqual([1]);
      expect(newMaxHeap.size).toBe(1);
      expect(newMaxHeap.isEmpty).toBeFalsy();
    });
  });

  describe('poll', () => {
    it('removes the maximum element from an empty max-heap', () => {
      // Arrange
      const maxHeap = new MaxHeap();

      // Act and Assert
      expect(maxHeap.poll()).toBeNull();
    });

    it('removes the maximum element from a max-heap with a single element', () => {
      const maxHeap = MaxHeap.of(10);

      // Act and Assert
      expect(maxHeap.poll()).toBe(10);
      expect(maxHeap.isEmpty).toBeTruthy();
    });

    it('removes the maximum element from the top and adjust the heap accordingly', () => {
      // Arrange
      const maxHeap = MaxHeap.of(1).insert(5).insert(3).insert(8).insert(12);

      // Act and Assert
      expect(maxHeap.poll()).toBe(12);
      expect(maxHeap.toArray()).toEqual([8, 5, 3, 1]);
      expect(maxHeap.size).toBe(4);

      // Act and Assert
      expect(maxHeap.poll()).toBe(8);
      expect(maxHeap.toArray()).toEqual([5, 1, 3]);
      expect(maxHeap.size).toBe(3);

      // Act and Assert
      expect(maxHeap.poll()).toBe(5);
      expect(maxHeap.toArray()).toEqual([3, 1]);
      expect(maxHeap.size).toBe(2);

      // Act and Assert
      expect(maxHeap.poll()).toBe(3);
      expect(maxHeap.toArray()).toEqual([1]);
      expect(maxHeap.size).toBe(1);

      // Act and Assert
      expect(maxHeap.poll()).toBe(1);
      expect(maxHeap.isEmpty).toBeTruthy();
    });
  });

  describe('delete', () => {
    // Arrange
    let maxHeap: MaxHeap<number>;

    beforeEach(() => {
      maxHeap = MaxHeap.of(12).insert(8).insert(7).insert(3).insert(5);
    });

    it('deletes non-existing element', () => {
      // Act
      const deletedValue = maxHeap.delete((x) => x === 4);

      // Assert
      expect(deletedValue).toBeNull();
      expect(maxHeap.toArray()).toEqual([12, 8, 7, 3, 5]);
      expect(maxHeap.size).toBe(5);
    });

    it('deletes the last element without heapifying', () => {
      // Act
      const deletedElement = maxHeap.delete((x) => x === 5);

      // Assert
      expect(deletedElement).toBe(5);
      expect(maxHeap.toArray()).toEqual([12, 8, 7, 3]);
      expect(maxHeap.size).toBe(4);
    });

    it('deletes element', () => {
      // Act
      const deletedValue = maxHeap.delete((x) => x === 8);

      // Assert
      expect(deletedValue).toBe(8);
      expect(maxHeap.toArray()).toEqual([12, 5, 7, 3]);
      expect(maxHeap.size).toBe(4);
    });

    it('deletes the top element', () => {
      // Act
      const deletedElement = maxHeap.delete((x) => x === 12);

      // Assert
      expect(deletedElement).toBe(12);
      expect(maxHeap.peek()).toBe(8);
      expect(maxHeap.toArray()).toEqual([8, 5, 7, 3]);
    });
  });

  describe('clear', () => {
    it('deletes all elements', () => {
      // Arrange
      const maxHeap = MaxHeap.of(3).insert(5).insert(1);

      // Act
      maxHeap.clear();

      // Assert
      expect(maxHeap.isEmpty).toBeTruthy();
    });
  });
});
