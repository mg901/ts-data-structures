import { describe, expect, it } from 'vitest';
import { SegmentTree } from './index';

describe('Segment Tree', () => {
  describe('build', () => {
    it('creates a correct segment tree for a single element', () => {
      // Arrange
      const expected = 42;

      // Act
      const st = new SegmentTree([expected]);
      const tree = st.getTree();

      // Assert
      expect(tree[0]).toBe(expected);
    });

    it('creates a correct segment tree for [1, 2, 3, 4]', () => {
      // Act
      const st = new SegmentTree([1, 2, 3, 4]);
      const tree = st.getTree();

      // Assert
      expect(tree[0]).toBe(10);
      expect(tree[1]).toBe(3);
      expect(tree[2]).toBe(7);
      expect(tree[3]).toBe(1);
      expect(tree[4]).toBe(2);
      expect(tree[5]).toBe(3);
      expect(tree[6]).toBe(4);
    });
  });
});
