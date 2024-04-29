import { beforeEach, describe, expect, it } from 'vitest';
import { PriorityQueue } from './index';

describe('PriorityQueue', () => {
  it('creates an empty priority queue', () => {
    // Act
    const priorityQueue = new PriorityQueue();

    // Assert
    expect(priorityQueue).toBeDefined();
    expect(priorityQueue.size).toBe(0);
    expect(priorityQueue.isEmpty).toBeTruthy();
  });

  describe('insert', () => {
    it('inserts an element with correct priority', () => {
      const priorityQueue = new PriorityQueue<number>();

      // Act
      priorityQueue.insert(5, 1);

      // Assert
      expect(priorityQueue.peek()).toBe(5);

      // Act
      priorityQueue.insert(10, 0);

      // Assert
      expect(priorityQueue.peek()).toBe(10);

      // Act
      priorityQueue.insert(15, 2);

      // Assert
      expect(priorityQueue.peek()).toBe(10);
    });
  });

  describe('changePriority', () => {
    it('changes priority on an element', () => {
      // Arrange
      const priorityQueue = new PriorityQueue();
      priorityQueue.insert(50, 0).insert(25, 1);

      expect(priorityQueue.peek()).toBe(50);

      // Act
      priorityQueue.changePriority(50, 2);

      // Assert
      expect(priorityQueue.peek()).toBe(25);
    });
  });

  describe('has', () => {
    it('checks if a value exists in a priority queue', () => {
      // Arrange
      const priorityQueue = new PriorityQueue();
      priorityQueue.insert(10);

      // Act and Assert
      expect(priorityQueue.has(10)).toBeTruthy();
      expect(priorityQueue.has(50)).toBeFalsy();
    });
  });

  describe('delete', () => {
    // Arrange
    let priorityQueue: PriorityQueue<number>;

    beforeEach(() => {
      priorityQueue = new PriorityQueue()
        .insert(8, 0)
        .insert(7, 10)
        .insert(3, 5)
        .insert(50, 2);
    });

    it('returns null if the specified value is not found in the heap', () => {
      // Act
      const deletedValue = priorityQueue.delete(4);

      // Assert
      expect(deletedValue).toBeNull();
      expect(priorityQueue.toString()).toBe('8,50,3,7');
      expect(priorityQueue.size).toBe(4);
    });

    it('deletes the last element from the heap without heapifying if it is  the last one', () => {
      // Act
      const deletedElement = priorityQueue.delete(7);

      // Assert
      expect(deletedElement).toBe(7);
      expect(priorityQueue.toString()).toBe('8,50,3');
      expect(priorityQueue.size).toBe(3);
    });

    it('deletes the specified value from the heap and returns it if found', () => {
      // Act
      const deletedValue = priorityQueue.delete(3);

      // Assert
      expect(deletedValue).toBe(3);
      expect(priorityQueue.toString()).toBe('8,50,7');
      expect(priorityQueue.size).toBe(3);
    });

    it('deletes the first element', () => {
      // Act and Assert
      expect(priorityQueue.delete(50)).toBe(50);
      expect(priorityQueue.peek()).toBe(8);
      expect(priorityQueue.toString()).toBe('8,7,3');
    });
  });

  describe('clear', () => {
    it('remove all elements', () => {
      // Arrange
      const priorityQueue = new PriorityQueue().insert(5).insert(1);

      // Act
      priorityQueue.clear();

      // Assert
      expect(priorityQueue.isEmpty).toBeTruthy();
    });
  });
});
