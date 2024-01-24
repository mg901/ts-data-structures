import { describe, beforeEach, it, expect } from 'vitest';
import { Dequeue } from './dequeue';

describe('Dequeue', () => {
  let dequeue: Dequeue<number>;

  beforeEach(() => {
    dequeue = new Dequeue<number>();
  });

  it('adds elements to the front', () => {
    // Act
    dequeue.addFront(1).addFront(2);

    // Assert
    expect(dequeue.peekFront()?.data).toBe(2);
    expect(dequeue.size).toBe(2);
  });

  it('removes elements from the front', () => {
    // Arrange
    dequeue.addFront(1).addFront(2);

    // Act and Assert
    expect(dequeue.removeFront()?.data).toBe(2);
    expect(dequeue.removeFront()?.data).toBe(1);
    expect(dequeue.removeFront()).toBeNull();
    expect(dequeue.size).toBe(0);
  });
});
