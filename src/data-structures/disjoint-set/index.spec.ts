import { beforeEach, describe, expect, test } from 'vitest';
import { DisjointSet } from './index.js';

describe('DisjointSet', () => {
  let ds: DisjointSet;

  beforeEach(() => {
    ds = new DisjointSet(5);
  });
  test('initialize', () => {
    for (let i = 0; i < 5; i += 1) {
      // Act & Assert
      expect(ds.find(i)).toBe(i);
    }
  });

  test('union', () => {
    // Act & Assert
    expect(ds.union(0, 1)).toBeTruthy();
    expect(ds.connected(0, 1)).toBeTruthy();
    expect(ds.connected(1, 0)).toBeTruthy();
  });

  test('already connected elements', () => {
    // Act
    ds.union(0, 1);

    // Act & Asset
    expect(ds.union(0, 1)).toBeFalsy();
  });

  test('multiple unions', () => {
    // Act
    ds.union(0, 1);
    ds.union(1, 2);
    ds.union(3, 4);

    // Assert
    expect(ds.connected(0, 2)).toBeTruthy();
    expect(ds.connected(0, 3)).toBeFalsy();
    expect(ds.connected(3, 4)).toBeTruthy();

    // Act
    ds.union(2, 4);

    // Assert
    expect(ds.connected(0, 4)).toBeTruthy();
  });

  test('unrelated elements', () => {
    // Act
    ds.union(0, 1);
    ds.union(2, 3);

    // Assert
    expect(ds.connected(0, 2)).toBeFalsy();
    expect(ds.connected(1, 3)).toBeFalsy();
    expect(ds.connected(4, 4)).toBeTruthy();
  });
});
