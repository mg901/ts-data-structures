import { describe, expect, test } from 'vitest';
import { DisjointSet } from './index.js';

describe('DisjointSet', () => {
  test('initialize', () => {
    const ds = new DisjointSet(5);
    for (let i = 0; i < 5; i += 1) {
      expect(ds.find(i)).toBe(i);
    }
  });

  test('union', () => {
    const ds = new DisjointSet(5);
    expect(ds.union(0, 1)).toBe(true);
    expect(ds.connected(0, 1)).toBe(true);
    expect(ds.connected(1, 0)).toBe(true);
  });

  test('already connected elements', () => {
    const ds = new DisjointSet(5);
    ds.union(0, 1);
    expect(ds.union(0, 1)).toBe(false);
  });

  test('multiple unions', () => {
    const ds = new DisjointSet(5);
    ds.union(0, 1);
    ds.union(1, 2);
    ds.union(3, 4);

    expect(ds.connected(0, 2)).toBe(true);
    expect(ds.connected(0, 3)).toBe(false);
    expect(ds.connected(3, 4)).toBe(true);

    ds.union(2, 4);
    expect(ds.connected(0, 4)).toBe(true);
  });

  test('unrelated elements', () => {
    const ds = new DisjointSet(5);
    ds.union(0, 1);
    ds.union(2, 3);

    expect(ds.connected(0, 2)).toBe(false);
    expect(ds.connected(1, 3)).toBe(false);
    expect(ds.connected(4, 4)).toBe(true);
  });
});
