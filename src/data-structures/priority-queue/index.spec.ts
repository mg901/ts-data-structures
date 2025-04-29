import { beforeEach, describe, expect, it } from 'vitest';
import { PriorityQueue } from './index';

describe('PriorityQueue', () => {
  it('creates an empty heap', () => {
    // Act
    const pq = new PriorityQueue();

    // Assert
    expect(pq).toBeDefined();
    expect(pq.toArray()).toEqual([]);
    expect(pq.toString()).toEqual('');
    expect(pq.size).toBe(0);
    expect(pq.isEmpty).toBeTruthy();
  });

  describe('enqueue', () => {
    it('adds items to the heap', () => {
      // Arrange
      const minHeap = new PriorityQueue<number>();

      // Act
      minHeap.enqueue(10).enqueue(1);

      // Assert
      expect(minHeap.toArray()).toEqual([1, 10]);
      expect(minHeap.front()).toBe(1);
      expect(minHeap.size).toBe(2);
      expect(minHeap.isEmpty).toBeFalsy();

      // Act;
      minHeap.enqueue(3);

      // Assert
      expect(minHeap.toArray()).toEqual([1, 10, 3]);
      expect(minHeap.front()).toBe(1);

      // Act
      minHeap.enqueue(5);

      // Assert
      expect(minHeap.toArray()).toEqual([1, 5, 3, 10]);
      expect(minHeap.front()).toBe(1);

      // Act
      minHeap.enqueue(8);

      // Assert
      expect(minHeap.toArray()).toEqual([1, 5, 3, 10, 8]);
      expect(minHeap.front()).toBe(1);

      // Act
      minHeap.enqueue(20);

      // Assert
      expect(minHeap.toArray()).toEqual([1, 5, 3, 10, 8, 20]);
      expect(minHeap.front()).toBe(1);
    });
  });

  describe('of', () => {
    it('creates the new heap with a single element', () => {
      // Act
      const pq = PriorityQueue.of(1);

      // Assert
      expect(pq.toArray()).toEqual([1]);
      expect(pq.size).toBe(1);
      expect(pq.isEmpty).toBeFalsy();
    });
  });

  describe('dequeue', () => {
    it('tries to remove a non-existing element', () => {
      // Arrange
      const pq = new PriorityQueue();

      // Act and Assert
      expect(pq.dequeue()).toBeNull();
    });

    it('removes the top element from the heap with a single element', () => {
      // Arrange
      const pq = PriorityQueue.of(10);

      // Act and Assert
      expect(pq.dequeue()).toBe(10);
      expect(pq.isEmpty).toBeTruthy();
    });

    it('removes the top element from the heap', () => {
      // Arrange
      const pq = PriorityQueue.of(1)
        .enqueue(5)
        .enqueue(3)
        .enqueue(8)
        .enqueue(2);

      expect(pq.toArray()).toEqual([1, 2, 3, 8, 5]);

      // Act and Assert
      expect(pq.dequeue()).toBe(1);
      expect(pq.toArray()).toEqual([2, 5, 3, 8]);
      expect(pq.size).toBe(4);

      // Act and Assert
      expect(pq.dequeue()).toBe(2);
      expect(pq.toArray()).toEqual([3, 5, 8]);
      expect(pq.size).toBe(3);

      // Act and Assert
      expect(pq.dequeue()).toBe(3);
      expect(pq.toArray()).toEqual([5, 8]);
      expect(pq.size).toBe(2);

      // Act and Assert
      expect(pq.dequeue()).toBe(5);
      expect(pq.toArray()).toEqual([8]);
      expect(pq.size).toBe(1);

      // Act and Assert
      expect(pq.dequeue()).toBe(8);
      expect(pq.isEmpty).toBeTruthy();
    });
  });

  describe('remove', () => {
    // Arrange
    let minHeap: PriorityQueue<number>;

    beforeEach(() => {
      minHeap = PriorityQueue.of(12)
        .enqueue(8)
        .enqueue(7)
        .enqueue(3)
        .enqueue(5);
    });

    it('tries to remove a non-existing element', () => {
      // Act
      const removedValue = minHeap.remove((x) => x === 4);

      // Assert
      expect(removedValue).toBeNull();
      expect(minHeap.toArray()).toEqual([3, 5, 8, 12, 7]);
      expect(minHeap.size).toBe(5);
    });

    it('removes the last element', () => {
      // Act
      const removedElement = minHeap.remove((x) => x === 7);

      // Assert
      expect(removedElement).toBe(7);
      expect(minHeap.toArray()).toEqual([3, 5, 8, 12]);
      expect(minHeap.size).toBe(4);
    });

    it('removes element', () => {
      // Act
      const deletedValue = minHeap.remove((x) => x === 5);

      // Assert
      expect(deletedValue).toBe(5);
      expect(minHeap.toArray()).toEqual([3, 7, 8, 12]);
      expect(minHeap.size).toBe(4);
    });

    it('removes the top element', () => {
      // Act and Assert
      expect(minHeap.remove((x) => x === 3)).toBe(3);
      expect(minHeap.front()).toBe(5);
      expect(minHeap.toArray()).toEqual([5, 7, 8, 12]);
    });
  });

  describe('front', () => {
    it('tries to return the first element from the empty queue', () => {
      // Arrange
      const pq = new PriorityQueue();

      // Act & Assert
      expect(pq.front()).toBeNull();
    });

    it('returns the first element', () => {
      // Arrange
      const pq = PriorityQueue.fromArray([7, 1, 3]);

      // Act & Assert
      expect(pq.front()).toBe(1);
    });
  });

  describe('back', () => {
    it('tries to return the last element from the empty queue', () => {
      // Arrange
      const pq = new PriorityQueue();

      // Act & Assert
      expect(pq.back()).toBeNull();
    });

    it('returns the last element', () => {
      // Arrange
      const pq = PriorityQueue.fromArray([7, 1, 3]);

      // Act & Assert
      expect(pq.back()).toBe(3);
    });
  });

  describe('Symbol.Iterator', () => {
    it('should yield elements in ascending order', () => {
      const pq = PriorityQueue.fromArray([5, 2, 8, 1]);

      expect(Array.from(pq)).toEqual([1, 2, 5, 8]);
    });
  });

  describe('clear', () => {
    it('clears the heap', () => {
      // Arrange
      const pq = PriorityQueue.of(3).enqueue(5).enqueue(1);

      // Act
      pq.clear();

      // Assert
      expect(pq.isEmpty).toBeTruthy();
    });
  });
});
