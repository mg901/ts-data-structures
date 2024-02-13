import { beforeEach, describe, expect, it } from 'vitest';
import { BaseLinkedListNode } from './index';

describe('BaseLinkedListNode', () => {
  let node: BaseLinkedListNode<number>;

  beforeEach(() => {
    node = new BaseLinkedListNode<number>(1);
  });

  it('creates initial state correctly', () => {
    // Assert
    expect(node).toBeDefined();
    expect(node.data).toEqual(1);
    expect(node.next).toBeNull();
  });

  it('links nodes together', () => {
    // Act
    const node0 = new BaseLinkedListNode<number>(0, node);

    // Assert
    expect(node0.next).toBeDefined();
    expect(node.next).toBeNull();
    expect(node0.data).toEqual(0);
    expect(node0.next?.data).toEqual(1);
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

      const list = new BaseLinkedListNode<typeof nodeValue>(nodeValue);
      const toStringCallback = (x: typeof nodeValue) =>
        `value: ${x.value}, key: ${x.key}`;

      // Act
      const received = list.toString(toStringCallback);

      // Assert
      expect(received).toBe('value: 1, key: test');
    });
  });
});
