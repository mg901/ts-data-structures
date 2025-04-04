import { beforeEach, describe, expect, it } from 'vitest';
import { Queue } from './index';

describe('Queue', () => {
  let queue: Queue<number>;

  // Arrange
  beforeEach(() => {
    queue = new Queue();
  });

  it('creates the empty queue', () => {
    // Act and Assert
    expect(queue).toBeDefined();
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

    it('adds elements to the queue', () => {
      // Act
      queue.enqueue(10).enqueue(20).enqueue(30);

      // Assert
      expect(queue.toString()).toBe('10,20,30');
      expect(queue.size).toBe(3);
    });
  });

  describe('of', () => {
    it('creates a new queue with single value', () => {
      // Act
      const newQueue = Queue.of(1);

      // Assert
      expect(newQueue.front()).toBe(1);
    });
  });

  describe('Symbol.Iterator', () => {
    it('iterates through the elements', () => {
      // Arrange
      queue.enqueue(1).enqueue(2).enqueue(3);

      // Act and Assert
      expect(Array.from(queue)).toEqual([1, 2, 3]);
    });

    it('handles an empty queue', () => {
      // Act and Assert
      expect(Array.from(queue)).toEqual([]);
    });
  });

  describe('dequeue', () => {
    it('removes and returns the front element from the queue', () => {
      // Arrange
      queue.enqueue(10);
      queue.enqueue(20);
      queue.enqueue(30);

      // Act
      const removedElement = queue.dequeue();

      // Assert
      expect(removedElement).toBe(10);
      expect(queue.toString()).toBe('20,30');
      expect(queue.size).toBe(2);
    });

    it('returns null when deleting an element on the empty queue', () => {
      // Act
      const removedElement = queue.dequeue();

      // Assert
      expect(removedElement).toBeNull();
      expect(queue.size).toBe(0);
    });
  });

  describe('front', () => {
    it('tries to return the first element', () => {
      // Act
      const frontElement = queue.front();

      // Assert
      expect(frontElement).toBeNull();
    });

    it('returns the first element without removal', () => {
      // Arrange
      queue.enqueue(10);
      queue.enqueue(15);

      // Act
      const frontElement = queue.front();

      // Assert
      expect(frontElement).toBe(10);
      expect(queue.toString()).toBe('10,15');
      expect(queue.size).toBe(2);
    });
  });

  describe('back', () => {
    it('tries to return the last element', () => {
      // Act & Assert
      expect(queue.back()).toBeNull();
    });

    it('return the last element without removal', () => {
      // Arrange
      queue.enqueue(10);
      queue.enqueue(15);

      // Act
      const frontElement = queue.back();

      // Assert
      expect(frontElement).toBe(15);
      expect(queue.toString()).toBe('10,15');
      expect(queue.size).toBe(2);
    });
  });

  it('converts queue to array', () => {
    // Arrange
    queue.enqueue(1);
    queue.enqueue(2);
    queue.enqueue(3);

    // Act and Assert
    expect(queue.toArray()).toEqual([1, 2, 3]);
  });

  describe('clear', () => {
    it('removes all elements from the queue', () => {
      // Arrange
      queue.enqueue(7);
      queue.enqueue(14);

      // Act
      queue.clear();

      // Assert
      expect(queue.isEmpty).toBeTruthy();
      expect(queue.toArray()).toEqual([]);
      expect(queue.size).toBe(0);
    });
  });

  describe('toStringTag', () => {
    it('returns correct string representation', () => {
      // Assert
      expect(Object.prototype.toString.call(new Queue())).toBe(
        '[object Queue]',
      );
    });
  });
});
