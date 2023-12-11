import { describe, beforeEach, it, expect } from 'vitest';
import { Queue } from './queue';

describe('Queue', () => {
  // @ts-ignore
  let queue: Queue<number> = null;

  // Arrange
  beforeEach(() => {
    queue = new Queue();
  });

  it('returns the initial state of the queue correctly', () => {
    // Act and Assert
    expect(queue).not.toBeNull();
    expect(queue.isEmpty).toBeTruthy();
    expect(queue.size).toBe(0);
  });

  describe('enqueue', () => {
    it('adds an element to the queue', () => {
      // Act
      queue.enqueue(10);

      // Assert
      expect(queue.size).toBe(1);
    });
  });

  describe('isEmpty', () => {
    it('returns true for an empty queue', () => {
      // Act and Assert
      expect(queue.isEmpty).toBeTruthy();
    });

    it('returns false for an non-empty queue', () => {
      // Arrange
      queue.enqueue(30);

      // Assert
      expect(queue.isEmpty).toBeFalsy();
    });
  });

  describe('size', () => {
    it('returns the number of elements in the queue', () => {
      // Arrange
      queue.enqueue(10);
      queue.enqueue(20);
      queue.enqueue(30);

      // Act and Assert
      expect(queue.size).toBe(3);
    });
  });

  describe('dequeue', () => {
    it('removes and returns the front element from the queue', () => {
      // Arrange
      queue.enqueue(10);
      queue.enqueue(20);

      // Act
      const removedElement = queue.dequeue();

      // Assert
      expect(removedElement).toBe(10);
      expect(queue.size).toBe(1);
    });

    it('returns null when deleting an element on the empty queue', () => {
      // Act
      const removedElement = queue.dequeue();

      // Assert
      expect(removedElement).toBeUndefined();
      expect(queue.size).toBe(0);
    });
  });

  describe('peek', () => {
    it('returns the front element without removing it', () => {
      // Arrange
      queue.enqueue(5);
      queue.enqueue(15);

      // Act
      const frontElement = queue.pick();

      // Assert
      expect(frontElement).toBe(5);
      expect(queue.size).toBe(2);
    });
  });

  describe('clear', () => {
    it.todo('removes all elements from the queue', () => {
      // Arrange
      queue.enqueue(7);
      queue.enqueue(14);

      // Act
      queue.clear();

      // Assert
      expect(queue.isEmpty).toBeTruthy();
    });
  });
});
