import { beforeEach, describe, expect, it } from 'vitest';
import { MinHeap } from './index';

describe('MinHeap', () => {
  it('creates an empty MinHeap', () => {
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
    it('inserts items into the heap and ensures heap property is maintained', () => {
      // Arrange
      const minHeap = MinHeap.of(1);

      // Act
      minHeap.insert(10);

      // Assert
      expect(minHeap.toArray()).toEqual([1, 10]);
      expect(minHeap.peek()).toBe(1);
      expect(minHeap.size).toBe(2);
      expect(minHeap.isEmpty).toBeFalsy();

      // Act
      minHeap.insert(3);

      // Assert
      expect(minHeap.toArray()).toEqual([1, 10, 3]);
      expect(minHeap.peek()).toBe(1);

      // Act
      minHeap.insert(5);

      // Assert
      expect(minHeap.toArray()).toEqual([1, 5, 3, 10]);
      expect(minHeap.peek()).toBe(1);

      // Act
      minHeap.insert(8);

      // Assert
      expect(minHeap.toArray()).toEqual([1, 5, 3, 10, 8]);
      expect(minHeap.peek()).toBe(1);

      // Act
      minHeap.insert(20);

      // Assert
      expect(minHeap.toArray()).toEqual([1, 5, 3, 10, 8, 20]);
      expect(minHeap.peek()).toBe(1);
    });
  });

  describe('of', () => {
    it('creates a new heap with a single element', () => {
      // Act
      const minHeap = MinHeap.of(1);

      // Assert
      expect(minHeap.toArray()).toEqual([1]);
      expect(minHeap.size).toBe(1);
      expect(minHeap.isEmpty).toBeFalsy();
    });
  });

  describe('fromArray', () => {
    it('creates a min-heap from a array', () => {
      expect(MinHeap.fromArray([7, 3, 2]).toArray()).toEqual([2, 3, 7]);
    });
  });

  describe('poll', () => {
    it('removes the minimum element from an empty min-heap', () => {
      // Arrange
      const minHeap = new MinHeap();

      // Act and Assert
      expect(minHeap.poll()).toBeNull();
    });

    it('removes the minimum element from an min-heap with a single element', () => {
      // Arrange
      const minHeap = MinHeap.of(10);

      // Act and Assert
      expect(minHeap.poll()).toBe(10);
      expect(minHeap.isEmpty).toBeTruthy();
    });

    it('removes the minimum element from the top and adjust the heap accordingly', () => {
      // Arrange
      const minHeap = MinHeap.of(1).insert(5).insert(3).insert(8).insert(2);

      expect(minHeap.toArray()).toEqual([1, 2, 3, 8, 5]);

      // Act and Assert
      expect(minHeap.poll()).toBe(1);
      expect(minHeap.toArray()).toEqual([2, 5, 3, 8]);
      expect(minHeap.size).toBe(4);

      // Act and Assert
      expect(minHeap.poll()).toBe(2);
      expect(minHeap.toArray()).toEqual([3, 5, 8]);
      expect(minHeap.size).toBe(3);

      // Act and Assert
      expect(minHeap.poll()).toBe(3);
      expect(minHeap.toArray()).toEqual([5, 8]);
      expect(minHeap.size).toBe(2);

      // Act and Assert
      expect(minHeap.poll()).toBe(5);
      expect(minHeap.toArray()).toEqual([8]);
      expect(minHeap.size).toBe(1);

      // Act and Assert
      expect(minHeap.poll()).toBe(8);
      expect(minHeap.isEmpty).toBeTruthy();
    });
  });

  describe('delete', () => {
    // Arrange
    let minHeap: MinHeap<number>;

    beforeEach(() => {
      minHeap = MinHeap.of(12).insert(8).insert(7).insert(3).insert(5);
    });

    it('returns null if the specified value is not found in the heap', () => {
      // Act
      const deletedValue = minHeap.delete(4);

      // Assert
      expect(deletedValue).toBeNull();
      expect(minHeap.toArray()).toEqual([3, 5, 8, 12, 7]);
      expect(minHeap.size).toBe(5);
    });

    it('deletes the last element from the heap without heapifying if it is  the last one', () => {
      // Act
      const deletedElement = minHeap.delete(7);

      // Assert
      expect(deletedElement).toBe(7);
      expect(minHeap.toArray()).toEqual([3, 5, 8, 12]);
      expect(minHeap.size).toBe(4);
    });

    it.todo(
      'deletes the specified value from the heap and returns it if found',
      () => {
        // Act
        const deletedValue = minHeap.delete(5);

        // Assert
        expect(deletedValue).toBe(5);
        expect(minHeap.toArray()).toEqual([3, 7, 8, 12]);
        expect(minHeap.size).toBe(4);
      },
    );

    it.todo('deletes the minimum value from the top of the heap', () => {
      // Act and Assert
      expect(minHeap.delete(3)).toBe(3);
      expect(minHeap.peek()).toBe(5);
      expect(minHeap.toArray()).toEqual([5, 7, 8, 12]);
    });
  });

  describe('clear', () => {
    it('remove all elements', () => {
      // Arrange
      const minHeap = MinHeap.of(3).insert(5).insert(1);

      // Act
      minHeap.clear();

      // Assert
      expect(minHeap.isEmpty).toBeTruthy();
    });
  });
});
