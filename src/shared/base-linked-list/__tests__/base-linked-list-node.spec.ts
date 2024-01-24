import { describe, it, expect } from 'vitest';
import { BaseLinkedListNode } from '../base-linked-list-node';

class BaseLinkedListNodeTest<T> extends BaseLinkedListNode<T> {}

describe('BaseLinkedListNode', () => {
  it('creates list node with value', () => {
    // Act
    const node = new BaseLinkedListNodeTest<number>(1);

    // Assert
    expect(node.data).toEqual(1);
    expect(node.next).toBeNull();
  });

  it('creates list node with object as a value', () => {
    // Arrange
    const nodeValue = {
      value: 1,
      key: 'test',
    };

    // Act
    const node = new BaseLinkedListNodeTest<typeof nodeValue>(nodeValue);

    // Assert
    expect(node.data.value).toEqual(1);
    expect(node.data.key).toEqual('test');
    expect(node.next).toBeNull();
  });

  it('links nodes together', () => {
    // Arrange
    const node2 = new BaseLinkedListNodeTest<number>(1);

    // Act
    const node1 = new BaseLinkedListNodeTest<number>(2, node2);

    // Assert
    expect(node1.next).toBeDefined();
    expect(node2.next).toBeNull();
    expect(node1.data).toEqual(2);
    expect(node1.next?.data).toEqual(1);
  });

  describe('toString', () => {
    it('converts node to string', () => {
      // Arrange
      const node = new BaseLinkedListNodeTest<number>(1);

      // Act and Assert
      expect(node.toString()).toEqual('1');
    });

    it('converts node to string with custom stringifier', () => {
      // Arrange
      const nodeValue = {
        value: 1,
        key: 'test',
      };

      const list = new BaseLinkedListNodeTest<typeof nodeValue>(nodeValue);
      const toStringCallback = (x: typeof nodeValue) =>
        `value: ${x.value}, key: ${x.key}`;

      // Act
      const received = list.toString(toStringCallback);

      // Assert
      expect(received).toBe('value: 1, key: test');
    });
  });
});
