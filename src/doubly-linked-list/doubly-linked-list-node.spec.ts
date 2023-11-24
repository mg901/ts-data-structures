import { describe, it, expect } from 'vitest';
import { DoublyLinkedListNode } from './doubly-linked-list-node';

describe('DoublyLinkedListNode', () => {
  it('creates list node with value', () => {
    // Arrange
    const list = new DoublyLinkedListNode<number>(1);

    // Act with Assert
    expect(list.value).toBe(1);
    expect(list.next).toBeNull();
    expect(list.prev).toBeNull();
  });

  it('creates list node with object with value', () => {
    // Arrange
    const expectedValue = {
      value: 1,
      key: 'test',
    };

    const list = new DoublyLinkedListNode<typeof expectedValue>(expectedValue);

    expect(list.value).toEqual(expectedValue);
    expect(list.next).toBeNull();
    expect(list.prev).toBeNull();
  });

  it('links node together', () => {
    // Arrange
    const node2 = new DoublyLinkedListNode<number>(2);
    const node1 = new DoublyLinkedListNode<number>(1, node2);
    const node3 = new DoublyLinkedListNode<number>(3, node1, node2);

    // Act and Assert
    expect(node1.next).toBeDefined();
    expect(node1.prev).toBeNull();
    expect(node2.next).toBeNull();
    expect(node2.prev).toBeNull();
    expect(node3.next).toBeDefined();
    expect(node3.prev).toBeDefined();
    expect(node1.value).toBe(1);
    expect(node1.next?.value).toBe(2);
    expect(node3.next?.value).toBe(1);
    expect(node3.prev?.value).toBe(2);
  });

  it('converts node to string', () => {
    // Arrange
    const list = new DoublyLinkedListNode<number>(1);

    // Assert
    expect(list.toString()).toBe('1');

    // Act
    list.value = 2;

    // Assert
    expect(list.toString()).toBe('2');
  });

  it('converts node to string with custom stringifier', () => {
    // Arrange
    const nodeValue = {
      value: 1,
      key: 'test',
    };

    const list = new DoublyLinkedListNode<typeof nodeValue>(nodeValue);

    const toStringCallback = (x: typeof nodeValue) =>
      `value: ${x.value}, key: ${x.key}`;

    // Act and Assert
    expect(list.toString(toStringCallback)).toBe('value: 1, key: test');
  });
});
