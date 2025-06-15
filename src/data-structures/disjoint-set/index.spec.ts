import { beforeEach, describe, expect, it } from 'vitest';
import { DisjointSet } from './index';

describe('DisjointSet', () => {
  let ds: DisjointSet;

  beforeEach(() => {
    ds = new DisjointSet(5);
  });

  describe('find', () => {
    it('returns the element itself if no union performed', () => {
      // Act & Assert
      expect(ds.find(0)).toBe(0);
      expect(ds.find(4)).toBe(4);
    });

    it('applies path compression', () => {
      // Arrange
      ds.union(0, 1);
      ds.union(1, 2);

      // Act
      const rootBefore = ds.find(0);

      // Assert
      expect(ds.find(2)).toBe(rootBefore);
    });
  });

  describe('union', () => {
    it('merges two sets', () => {
      // Act
      ds.union(0, 1);

      // Assert
      expect(ds.find(0)).toBe(ds.find(1));
    });

    it('does nothing if elements are already connected', () => {
      // Arrange
      ds.union(0, 1);
      const rootBefore = ds.find(0);

      // Act
      ds.union(0, 1);

      // Assert
      expect(ds.find(1)).toBe(rootBefore);
    });

    it('correctly updates ranks and parents', () => {
      // Arrange
      ds.union(0, 1);
      ds.union(2, 3);
      ds.union(0, 2);

      // Act
      const root = ds.find(0);

      // Assert
      expect(ds.find(1)).toBe(root);
      expect(ds.find(2)).toBe(root);
      expect(ds.find(3)).toBe(root);
    });
  });

  describe('connected', () => {
    it('returns true for connected elements', () => {
      // Arrange
      ds.union(2, 3);

      // Act & Assert
      expect(ds.connected(2, 3)).toBe(true);
    });

    it('returns false for disconnected elements', () => {
      // Act and Assert
      expect(ds.connected(0, 4)).toBe(false);
    });
  });
});
