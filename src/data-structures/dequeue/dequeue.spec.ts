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

    // Act and
    expect(dequeue.peekFront()?.data).toBe(2);
    expect(dequeue.size).toBe(2);
  });
});
