import { describe, beforeEach, it, expect } from 'vitest';
import { LRUCacheOnMap } from '../lru-cache-on-map';

describe('LRUCacheOnMap', () => {
  let cache: LRUCacheOnMap<string, number>;

  // Arrange
  beforeEach(() => {
    cache = new LRUCacheOnMap<string, number>(2);

    cache.put('one', 1);
    cache.put('two', 2);
  });

  it('stores and retrieve values', () => {
    // Assert
    expect(cache.get('one')).toBe(1);
    expect(cache.get('two')).toBe(2);
  });

  it('evicts least recently used item when exceeding capacity', () => {
    // Act
    cache.get('one'); // Move 1 to the front
    cache.put('three', 3); // Should evict 2

    // Assert
    expect(cache.get('one')).toBe(1);
    expect(cache.get('two')).toBe(-1);
    expect(cache.get('three')).toBe(3);
  });

  it('updates value for an existing key', () => {
    // Arrange
    cache.put('value', 10);
    expect(cache.get('value')).toBe(10);

    // Act
    cache.put('value', 20);

    // Assert
    expect(cache.get('value')).toBe(20);
  });
});
