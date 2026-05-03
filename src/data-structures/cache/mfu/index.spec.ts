import { beforeEach, describe, expect, it } from 'vitest';
import { MFUCache } from './index';

describe('MFUCache', () => {
  let cache: MFUCache<string, number>;

  beforeEach(() => {
    cache = new MFUCache(2);
  });

  it('returns -1 for a missing key', () => {
    expect(cache.get('a')).toBe(-1);
  });

  it('stores and retrieves a value', () => {
    cache.put('a', 1);
    expect(cache.get('a')).toBe(1);
  });

  it('updates an existing key and increments frequency', () => {
    cache.put('a', 1);
    cache.put('a', 2);
    expect(cache.get('a')).toBe(2);
  });

  it('evicts the most frequently used key when capacity is exceeded', () => {
    cache.put('a', 1);
    cache.put('b', 2);
    cache.get('a'); // freq a = 2
    cache.put('c', 3); // evicts a (most frequently used)

    expect(cache.get('a')).toBe(-1);
    expect(cache.get('b')).toBe(2);
    expect(cache.get('c')).toBe(3);
  });

  it('handles capacity of zero', () => {
    const zeroCache = new MFUCache<string, number>(0);
    zeroCache.put('a', 1);
    expect(zeroCache.get('a')).toBe(-1);
  });
});
