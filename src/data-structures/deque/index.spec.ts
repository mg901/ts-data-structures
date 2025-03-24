import { beforeEach, describe, expect, it } from 'vitest';
import { Deque } from './index';

describe('Deque', () => {
  let deque: Deque<number>;

  beforeEach(() => {
    deque = new Deque<number>();
  });

  it('returns the initial state of the queue correctly', () => {
    // Act and Assert
    expect(deque).toBeDefined();
    expect(deque.size).toBe(0);
    expect(deque.toString()).toBe('');
    expect(deque.isEmpty).toBeTruthy();
  });

  describe('Symbol.Iterator', () => {
    it('iterates through the elements', () => {
      // Arrange
      deque.addRear(1).addRear(2).addRear(3);

      // Act and Assert
      expect(Array.from(deque)).toEqual([1, 2, 3]);
    });

    it('handles an empty deque', () => {
      // Act and Assert
      expect(Array.from(deque)).toEqual([]);
    });
  });

  describe('addFront', () => {
    it('adds elements to the front in the correct order', () => {
      // Act
      deque.addFront(2);

      // Assert
      expect(deque.toString()).toBe('2');
      expect(deque.size).toBe(1);

      // Act
      deque.addFront(1);

      // Assert
      expect(deque.toString()).toBe('1,2');
      expect(deque.size).toBe(2);
    });
  });

  describe('removeFront', () => {
    it('removes elements from the front in the correct order', () => {
      // Arrange
      deque.addFront(1).addFront(2);

      // Act and Assert
      expect(deque.removeFront()).toBe(2);
      expect(deque.removeFront()).toBe(1);
      expect(deque.removeFront()).toBeNull();
      expect(deque.size).toBe(0);
    });
  });

  describe('peekFront', () => {
    it('peeks elements from the front without removing it', () => {
      // Act and Assert
      expect(deque.peekFront()).toBeNull();

      deque.addFront(2);

      // Act and Assert
      expect(deque.peekFront()).toBe(2);

      deque.addFront(1);

      // Act and Assert
      expect(deque.peekFront()).toBe(1);
    });
  });

  describe('addRear', () => {
    it('add elements to the rear in the correct order', () => {
      // Act
      deque.addRear(1);

      // Assert
      expect(deque.toString()).toBe('1');
      expect(deque.size).toBe(1);

      // Act
      deque.addRear(2);

      // // Assert
      expect(deque.toString()).toBe('1,2');
      expect(deque.size).toBe(2);
    });
  });

  describe('of', () => {
    it('creates a deque with single element', () => {
      // Act
      const newDeque = Deque.of(1);

      // Assert
      expect(newDeque.peekFront()).toBe(1);
    });
  });

  describe('removeRead', () => {
    it('removes elements from the rear in the correct order', () => {
      // Arrange
      deque.addRear(1).addRear(2);

      // Act and Assert
      expect(deque.removeRear()).toBe(2);
      expect(deque.removeRear()).toBe(1);
      expect(deque.removeRear()).toBeNull();
      expect(deque.size).toBe(0);
    });
  });

  describe('peekRear', () => {
    it('peeks elements from the rear without removing it', () => {
      // Act and Assert
      expect(deque.peekRear()).toBeNull();

      deque.addRear(1);

      // Act and Assert
      expect(deque.peekRear()).toBe(1);

      deque.addRear(2);

      // Act and Assert
      expect(deque.peekRear()).toBe(2);
    });
  });

  describe('toStringTag', () => {
    it('returns correct string representation', () => {
      // Assert
      expect(Object.prototype.toString.call(new Deque())).toBe(
        '[object Deque]',
      );
    });
  });
});
