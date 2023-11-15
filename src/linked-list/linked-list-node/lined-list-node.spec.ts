import { describe, test, expect } from 'bun:test';
import { LinkedListNode } from './linked-list-node';

describe('LinkedListNode', () => {
  test('creates list node with value', () => {
    // Act
    const node = new LinkedListNode<number>(1);

    // Assert
    expect(node.value).toEqual(1);
    expect(node.next).toBeNull();
  });

  test('creates list node with object as a value', () => {
    // Arrange
    const nodeValue = {
      value: 1,
      key: 'test',
    };

    // Act
    const node = new LinkedListNode<typeof nodeValue>(nodeValue);

    // Assert
    expect(node.value.value).toEqual(1);
    expect(node.value.key).toEqual('test');
    expect(node.next).toBeNull();
  });

  test('links nodes together', () => {
    // Arrange and Act
    const node2 = new LinkedListNode<number>(1);
    const node1 = new LinkedListNode<number>(2, node2);

    // Assert
    expect(node1.next).toBeDefined();
    expect(node2.next).toBeNull();
    expect(node1.value).toEqual(2);
    expect(node1.next?.value).toEqual(1);
  });

  test('converts node to string', () => {
    // Arrange
    const node = new LinkedListNode(1);
    expect(node.toString()).toEqual('1');

    // Act
    node.value = 'new value';

    // Assert
    expect(node.toString()).toEqual('new value');
  });
});
