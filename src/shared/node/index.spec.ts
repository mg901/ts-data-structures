import { beforeEach, describe, expect, it } from 'vitest';
import { Node } from './index';

describe('Node', () => {
  let node: Node<number>;

  // Arrange
  beforeEach(() => {
    node = new Node<number>(1);
  });

  it('creates initial state correctly', () => {
    // Assert
    expect(node).toBeDefined();
    expect(node.data).toEqual(1);
  });

  describe('toString', () => {
    it('converts node to string', () => {
      // Act and Assert
      expect(node.toString()).toEqual('1');
    });

    it('converts node to string with custom stringifier', () => {
      // Arrange
      const nodeValue = {
        value: 1,
        key: 'test',
      };

      const list = new Node<typeof nodeValue>(nodeValue);
      const toStringCallback = (x: typeof nodeValue) =>
        `value: ${x.value}, key: ${x.key}`;

      // Act
      const received = list.toString(toStringCallback);

      // Assert
      expect(received).toBe('value: 1, key: test');
    });
  });
});
