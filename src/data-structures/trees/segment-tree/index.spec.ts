import { describe, expect, it } from 'vitest';
import { SegmentTree } from './index';

describe('Segment Tree', () => {
  describe('build', () => {
    it('creates a segment tree for a single element', () => {
      // Arrange
      const expected = 42;

      // Act
      const st = new SegmentTree([expected]);
      const tree = st.getTree();

      // Assert
      expect(tree[0]).toBe(expected);
    });

    it('creates a segment tree for [1, 2, 3, 4]', () => {
      // Act
      const st = new SegmentTree([1, 2, 3, 4]);
      const tree = st.getTree();

      // Assert
      expect(tree[0]).toBe(10); // 1 + 2 + 3 + 4
      expect(tree[1]).toBe(3); // 1 + 2
      expect(tree[2]).toBe(7); // 3 + 4
      expect(tree[3]).toBe(1);
      expect(tree[4]).toBe(2);
      expect(tree[5]).toBe(3);
      expect(tree[6]).toBe(4);
    });
  });

  describe('update', () => {
    it('updates value at index 0', () => {
      // Arrange
      const st = new SegmentTree([1, 2, 3, 4]);
      const tree = st.getTree();

      // Act
      st.update(0, 10);

      // Assert
      expect(tree[0]).toBe(19); // 10 + 2 + 3 + 4
      expect(tree[1]).toBe(12); // 10 + 2
      expect(tree[3]).toBe(10);
    });

    it('updates value at index 3', () => {
      // Arrange
      const st = new SegmentTree([1, 2, 3, 4]);
      const tree = st.getTree();

      // Act
      st.update(3, 7);

      // Assert
      expect(tree[0]).toBe(13); // 1 + 2 + 3 + 7
      expect(tree[2]).toBe(10); // 3 + 7
      expect(tree[6]).toBe(7);
    });

    it('handles multiple updates', () => {
      // Arrange
      const st = new SegmentTree([5, 5, 5, 5]);
      const tree = st.getTree();

      // Act
      st.update(1, 1);
      st.update(2, 2);

      // Assert
      expect(tree[0]).toBe(13); // 5 + 1 + 2 + 5
      expect(tree[1]).toBe(6); // 5 + 1
      expect(tree[2]).toBe(7); // 2 + 7
      expect(tree[4]).toBe(1);
      expect(tree[5]).toBe(2);
    });
  });
});
