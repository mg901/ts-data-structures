import { beforeEach, describe, expect, it } from 'vitest';
import { MinHeap } from './index';

describe('MinHeap', () => {
  it('creates an empty MinHeap', () => {
    // Act
    const minHeap = new MinHeap();

    // Assert
    expect(minHeap).toBeDefined();
    expect(minHeap.toString()).toBe('');
    expect(minHeap.size).toBe(0);
    expect(minHeap.isEmpty).toBeTruthy();
  });

  describe('insert', () => {
    it('inserts items into the heap and ensures heap property is maintained', () => {
      const minHeap = MinHeap.of(1);

      // Act
      minHeap.insert(10);

      // Assert
      expect(minHeap.toString()).toBe('1,10');
      expect(minHeap.peek()).toBe(1);
      expect(minHeap.size).toBe(2);
      expect(minHeap.isEmpty).toBeFalsy();

      // Act
      minHeap.insert(3);

      // Assert
      expect(minHeap.toString()).toBe('1,10,3');
      expect(minHeap.peek()).toBe(1);

      // Act
      minHeap.insert(5);

      // Assert
      expect(minHeap.toString()).toBe('1,5,3,10');
      expect(minHeap.peek()).toBe(1);

      // // Act
      minHeap.insert(8);

      // Assert
      expect(minHeap.toString()).toBe('1,5,3,10,8');
      expect(minHeap.peek()).toBe(1);

      // // // Act
      minHeap.insert(20);

      // // Assert
      expect(minHeap.toString()).toBe('1,5,3,10,8,20');
      expect(minHeap.peek()).toBe(1);
    });
  });

  describe('poll', () => {
    it('removes the minimum element from an empty max-heap', () => {
      // Arrange
      const maxHeap = new MinHeap();
      // Act and Assert
      expect(maxHeap.poll()).toBeNull();
    });

    it('removes the minimum element from an max-heap with a single element', () => {
      const maxHeap = MinHeap.of(10);
      // Act and Assert
      expect(maxHeap.poll()).toBe(10);
      expect(maxHeap.isEmpty).toBeTruthy();
    });

    it('removes the minimum element from the top and adjust the heap accordingly', () => {
      // Arrange
      const maxHeap = MinHeap.of(1).insert(5).insert(3).insert(8).insert(2);
      expect(maxHeap.toString()).toBe('1,2,3,8,5');

      // Act and Assert
      expect(maxHeap.poll()).toBe(1);
      expect(maxHeap.toString()).toBe('2,5,3,8');
      expect(maxHeap.size).toBe(4);

      // Act and Assert
      expect(maxHeap.poll()).toBe(2);
      expect(maxHeap.toString()).toBe('3,5,8');
      expect(maxHeap.size).toBe(3);

      // Act and Assert
      expect(maxHeap.poll()).toBe(3);
      expect(maxHeap.toString()).toBe('5,8');
      expect(maxHeap.size).toBe(2);

      // // Act and Assert
      expect(maxHeap.poll()).toBe(5);
      expect(maxHeap.toString()).toBe('8');
      expect(maxHeap.size).toBe(1);

      // // Act and Assert
      expect(maxHeap.poll()).toBe(8);
      expect(maxHeap.isEmpty).toBeTruthy();
    });
  });

  describe('delete', () => {
    // Arrange
    let maxHeap: MinHeap<number>;

    beforeEach(() => {
      maxHeap = MinHeap.of(12).insert(8).insert(7).insert(3).insert(5);
    });

    it('returns null if the specified value is not found in the heap', () => {
      // Act
      const deletedValue = maxHeap.delete(4);

      // Assert
      expect(deletedValue).toBeNull();
      expect(maxHeap.toString()).toBe('3,5,8,12,7');
      expect(maxHeap.size).toBe(5);
    });

    it('deletes the last element from the heap without heapifying if it is  the last one', () => {
      // Act
      const deletedElement = maxHeap.delete(7);

      // Assert
      expect(deletedElement).toBe(7);
      expect(maxHeap.toString()).toBe('3,5,8,12');
      expect(maxHeap.size).toBe(4);
    });

    it('deletes the specified value from the heap and returns it if found', () => {
      // Act
      const deletedValue = maxHeap.delete(5);

      // Assert
      expect(deletedValue).toBe(5);
      expect(maxHeap.toString()).toBe('3,7,8,12');
      expect(maxHeap.size).toBe(4);
    });

    it('deletes the minimum value from the top of the heap', () => {
      // Act and Assert
      expect(maxHeap.delete(3)).toBe(3);
      expect(maxHeap.peek()).toBe(5);
      expect(maxHeap.toString()).toBe('5,7,8,12');
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
