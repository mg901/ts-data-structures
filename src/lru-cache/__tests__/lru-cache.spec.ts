import { describe, beforeEach, it, expect } from 'vitest';
import { LRUCache } from '..';

describe('LRUCache', () => {
  // @ts-ignore
  let cache = null as LRUCache<number, string>;

  // Arrange
  beforeEach(() => {
    cache = new LRUCache<number, string>(2);

    cache.put(1, 'value1');
    cache.put(2, 'value2');
  });

  it('stores and retrieve values', () => {
    // Act
    cache.put(1, 'value1');
    cache.put(2, 'value2');

    // Assert
    expect(cache.get(1)).toBe('value1');
    expect(cache.get(2)).toBe('value2');
  });

  it('evicts least recently used item when exceeding capacity', () => {
    // Act
    cache.get(1); // Move 1 to the front
    cache.put(3, 'value3'); // Should evict 2

    // Assert
    expect(cache.get(1)).toBe('value1');
    expect(cache.get(2)).toBe(-1); // 2 should be evicted
    expect(cache.get(3)).toBe('value3');
  });

  it('updates value for an existing key', () => {
    // Act
    cache.put(1, 'updatedValue');

    // Assert
    expect(cache.get(1)).toBe('updatedValue');
    expect(cache.get(2)).toBe('value2');
  });
});
