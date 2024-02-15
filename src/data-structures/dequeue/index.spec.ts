import { beforeEach, describe, expect, it } from 'vitest';
import { Dequeue } from './index';

describe('Dequeue', () => {
  let dequeue: Dequeue<number>;

  beforeEach(() => {
    dequeue = new Dequeue<number>();
  });

  it('returns the initial state of the queue correctly', () => {
    // Act and Assert
    expect(dequeue).not.toBeNull();
    expect(dequeue.size).toBe(0);
    expect(dequeue.toString()).toBe('');
    expect(dequeue.isEmpty).toBeTruthy();
  });

  describe('toStringTag', () => {
    it('returns correct string representation', () => {
      expect(Object.prototype.toString.call(new Dequeue())).toBe(
        '[object Dequeue]',
      );
    });
  });

  describe('isEmpty', () => {
    it('returns false for a non-empty stack', () => {
      // Act
      dequeue.addFront(1);

      // Assert
      expect(dequeue.isEmpty).toBeFalsy();
    });
  });

  describe('addFront', () => {
    it('adds elements to the front in the correct order', () => {
      // Act
      dequeue.addFront(2);

      // Assert
      expect(dequeue.toString()).toBe('2');
      expect(dequeue.size).toBe(1);

      // Act
      dequeue.addFront(1);

      // Assert
      expect(dequeue.toString()).toBe('1,2');
      expect(dequeue.size).toBe(2);
    });
  });

  describe('removeFront', () => {
    it('removes elements from the front in the correct order', () => {
      // Arrange
      dequeue.addFront(1).addFront(2);

      // Act and Assert
      expect(dequeue.removeFront()?.data).toBe(2);
      expect(dequeue.removeFront()?.data).toBe(1);
      expect(dequeue.removeFront()).toBeNull();
      expect(dequeue.size).toBe(0);
    });
  });

  describe('peekFront', () => {
    it('peeks elements from the front without removing it', () => {
      // Act and Assert
      expect(dequeue.peekFront()).toBeNull();

      dequeue.addFront(2);

      // Act and Assert
      expect(dequeue.peekFront()?.data).toBe(2);

      dequeue.addFront(1);

      // Act and Assert
      expect(dequeue.peekFront()?.data).toBe(1);
    });
  });

  describe('addRear', () => {
    it('add elements to the rear in the correct order', () => {
      // Act
      dequeue.addRear(1);

      // Assert
      expect(dequeue.toString()).toBe('1');
      expect(dequeue.size).toBe(1);

      // Act
      dequeue.addRear(2);

      // // Assert
      expect(dequeue.toString()).toBe('1,2');
      expect(dequeue.size).toBe(2);
    });
  });

  describe('removeRead', () => {
    it('removes elements from the rear in the correct order', () => {
      // Arrange
      dequeue.addRear(1).addRear(2);

      // Act and Assert
      expect(dequeue.removeRear()?.data).toBe(2);
      expect(dequeue.removeRear()?.data).toBe(1);
      expect(dequeue.removeRear()).toBeNull();
      expect(dequeue.size).toBe(0);
    });
  });

  describe('peekRear', () => {
    it('peeks elements from the rear without removing it', () => {
      // Act and Assert
      expect(dequeue.peekRear()).toBeNull();

      dequeue.addRear(1);

      // Act and Assert
      expect(dequeue.peekRear()?.data).toBe(1);

      dequeue.addRear(2);

      // Act and Assert
      expect(dequeue.peekRear()?.data).toBe(2);
    });
  });
});
