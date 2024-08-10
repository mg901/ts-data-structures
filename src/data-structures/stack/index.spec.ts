import { beforeEach, describe, expect, it } from 'vitest';
import { Stack } from './index';

describe('Stack', () => {
  let stack: Stack<number>;

  // Arrange
  beforeEach(() => {
    stack = new Stack<number>();
  });

  it('returns the initial state of the stack correctly', () => {
    // Act and Assert
    expect(stack).toBeDefined();
    expect(stack.isEmpty).toBeTruthy();
    expect(stack.size).toBe(0);
  });

  describe('of', () => {
    it('creates a new stack with single value', () => {
      // Act
      const newStack = Stack.of(1);

      // Assert
      expect(newStack.peek()).toBe(1);
    });
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
      stack.push(10).push(20).push(30);

      // Assert
      expect(stack.toString()).toBe('10,20,30');
      expect(stack.size).toBe(3);
    });
  });

  describe('Symbol.Iterator', () => {
    it('iterates through the elements', () => {
      // Arrange
      stack.push(1).push(2).push(3);

      // Act and Assert
      expect(Array.from(stack)).toEqual([1, 2, 3]);
    });

    it('handles an empty stack', () => {
      // Act and Assert
      expect(Array.from(stack)).toEqual([]);
    });
  });

  describe('peek', () => {
    it('returns null for an empty stack', () => {
      // Act and Assert
      expect(stack.peek()).toBeNull();
    });

    it('returns the value of top element', () => {
      // Arrange
      stack.push(1).push(2).push(3);

      // Act and Assert
      expect(stack.peek()).toBe(3);
    });
  });

  describe('pop', () => {
    it('removes and returns the top element from the stack', () => {
      // Arrange
      stack.push(7).push(14).push(21);

      // Act
      const poppedElement = stack.pop();

      // Assert
      expect(poppedElement).toBe(21);
      expect(stack.toString()).toBe('7,14');
      expect(stack.size).toBe(2);
    });

    it('returns null for an empty stack', () => {
      // Act
      const poppedElement = stack.pop();

      // Assert
      expect(poppedElement).toBeNull();
      expect(stack.size).toBe(0);
    });
  });

  describe('clear', () => {
    it('removes all elements from the stack', () => {
      // Arrange
      stack.push(10).push(20).push(30);

      // Act
      stack.clear();

      // Assert
      expect(stack.isEmpty).toBeTruthy();
      expect(stack.size).toBe(0);
    });
  });

  describe('toStringTag', () => {
    it('returns correct string representation', () => {
      // Assert
      expect(Object.prototype.toString.call(new Stack())).toBe(
        '[object Stack]',
      );
    });
  });
});
