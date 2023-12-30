import { describe, beforeEach, it, expect } from 'vitest';
import { Stack } from './stack';

describe('Stack', () => {
  let stack: Stack<number>;

  // Arrange
  beforeEach(() => {
    stack = new Stack();
  });

  it('returns the initial state of the stack correctly', () => {
    // Act and Assert
    expect(stack).not.toBeNull();
    expect(stack.isEmpty).toBeTruthy();
    expect(stack.size).toBe(0);
  });

  describe('push', () => {
    it('adds an element to the top of the stack', () => {
      // Act
      stack.push(1);

      // Assert
      expect(stack.size).toBe(1);
      expect(stack.toString()).toBe('1');
    });

    it('adds multiple elements to the top of the stack in the correct order', () => {
      // Act
      stack.push(10);
      stack.push(20);
      stack.push(30);

      // Assert
      expect(stack.toString()).toBe('30,20,10');
      expect(stack.size).toBe(3);
    });
  });

  describe('isEmpty', () => {
    it('returns false for a non-empty stack', () => {
      // Act
      stack.push(10);

      // Assert
      expect(stack.isEmpty).toBeFalsy();
      expect(stack.size).toBe(1);
    });
  });

  describe('size', () => {
    it('returns the number of the elements in the stack', () => {
      // Arrange
      stack.push(10);
      stack.push(20);
      stack.push(30);

      // Act and Assert
      expect(stack.size).toBe(3);
    });
  });

  describe('pop', () => {
    it('removes and returns the top element from the stack', () => {
      // Arrange
      stack.push(7);
      stack.push(14);
      stack.push(21);

      // Act
      const poppedElement = stack.pop();

      // Assert
      expect(poppedElement).toBe(21);
      expect(stack.toString()).toBe('14,7');
      expect(stack.size).toBe(2);
    });

    it('returns undefined for an empty stack', () => {
      // Act
      const poppedElement = stack.pop();

      // Assert
      expect(poppedElement).toBeUndefined();
      expect(stack.size).toBe(0);
    });
  });

  describe('clear', () => {
    it('removes all elements from the stack', () => {
      // Arrange
      stack.push(10);
      stack.push(20);
      stack.push(30);

      // Act
      stack.clear();

      // Assert
      expect(stack.isEmpty).toBeTruthy();
      expect(stack.size).toBe(0);
    });
  });
});