import { describe, expect, it } from 'vitest';
import { MaxHeap } from './index';

describe('MaxHeap', () => {
  it('creates an empty MaxHeap', () => {
    // Arrange
    const maxHeap = new MaxHeap();
    // Assert
    expect(maxHeap).toBeDefined();
    expect(maxHeap.size).toBe(0);
    expect(maxHeap.isEmpty).toBeTruthy();
  });

  describe('insert', () => {
    it('inserts items into the heap and ensures heap property is maintained', () => {
      const maxHeap = MaxHeap.of(1);

      // Act
      maxHeap.insert(10);

      // Assert
      expect(maxHeap.toString()).toBe('10,1');
      expect(maxHeap.size).toBe(2);
      expect(maxHeap.isEmpty).toBeFalsy();

      // Act
      maxHeap.insert(3);

      // Assert
      expect(maxHeap.toString()).toBe('10,1,3');
      expect(maxHeap.peek()).toBe(10);

      // Act
      maxHeap.insert(5);

      // Assert
      expect(maxHeap.toString()).toBe('10,5,3,1');
      expect(maxHeap.peek()).toBe(10);

      // Act
      maxHeap.insert(1);

      // Assert
      expect(maxHeap.toString()).toBe('10,5,3,1,1');
      expect(maxHeap.peek()).toBe(10);

      // Act
      maxHeap.insert(8);

      // Assert
      expect(maxHeap.toString()).toBe('10,5,8,1,1,3');
      expect(maxHeap.peek()).toBe(10);

      // // Act
      maxHeap.insert(20);

      // Assert
      expect(maxHeap.toString()).toBe('20,5,10,1,1,3,8');
      expect(maxHeap.peek()).toBe(20);
    });
  });

  describe('of', () => {
    it('creates a new heap with a single element', () => {
      // Act
      const newMaxHeap = MaxHeap.of(1);

      // Assert
      expect(newMaxHeap.toString()).toBe('1');
      expect(newMaxHeap.size).toBe(1);
      expect(newMaxHeap.isEmpty).toBeFalsy();
    });
  });

  describe('poll', () => {
    it('removes the maximum element from the top and adjust the heap accordingly', () => {
      // Arrange
      const maxHeap = MaxHeap.of(1).insert(5).insert(3).insert(8).insert(12);

      // Act and Assert
      expect(maxHeap.poll()).toBe(12);
      expect(maxHeap.toString()).toBe('8,5,3,1');
      expect(maxHeap.size).toBe(4);

      // Act and Assert
      expect(maxHeap.poll()).toBe(8);
      expect(maxHeap.toString()).toBe('5,1,3');
      expect(maxHeap.size).toBe(3);

      // Act and Assert
      expect(maxHeap.poll()).toBe(5);
      expect(maxHeap.toString()).toBe('3,1');
      expect(maxHeap.size).toBe(2);

      // Act and Assert
      expect(maxHeap.poll()).toBe(3);
      expect(maxHeap.toString()).toBe('1');
      expect(maxHeap.size).toBe(1);

      // Act and Assert
      expect(maxHeap.poll()).toBe(1);
      expect(maxHeap.isEmpty).toBeTruthy();
    });
  });

  describe('delete', () => {
    it('returns null if the specified value is not found in the heap', () => {
      // Arrange
      const maxHeap = MaxHeap.of(10).insert(5).insert(8).insert(3);

      // Act
      const deletedValue = maxHeap.delete(4);

      // Assert
      expect(deletedValue).toBeNull();
      expect(maxHeap.toString()).toBe('10,5,8,3');
      expect(maxHeap.size).toBe(4);
    });

    it('deletes the last element from the heap without heapifying if it is  the last one', () => {
      // Arrange
      const maxHeap = MaxHeap.of(10).insert(5).insert(8).insert(3);

      // Act
      const deletedElement = maxHeap.delete(3);

      // Assert
      expect(deletedElement).toBe(3);
      expect(maxHeap.toString()).toBe('10,5,8');
    });

    it('deletes the specified value from the heap and returns it if found', () => {
      // Arrange
      const maxHeap = MaxHeap.of(10).insert(5).insert(8).insert(3);

      // Act
      const deletedValue = maxHeap.delete(5);

      // Assert
      expect(deletedValue).toBe(5);
      expect(maxHeap.toString()).toBe('10,3,8');
      expect(maxHeap.size).toBe(3);
    });
  });
});
