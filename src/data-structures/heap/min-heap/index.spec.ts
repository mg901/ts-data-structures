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
      minHeap.insert(10).insert(1);

      // Assert
      expect(minHeap.toArray()).toEqual([1, 10]);
      expect(minHeap.peek()).toBe(1);
      expect(minHeap.size).toBe(2);
      expect(minHeap.isEmpty).toBeFalsy();

      // Act;
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
    it('creates the new heap with a single element', () => {
      // Act
      const minHeap = MinHeap.of(1);

      // Assert
      expect(minHeap.toArray()).toEqual([1]);
      expect(minHeap.size).toBe(1);
      expect(minHeap.isEmpty).toBeFalsy();
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
      expect(minHeap.peek()).toBe(5);
      expect(minHeap.toArray()).toEqual([5, 7, 8, 12]);
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
    });
  });
});
