import { describe, test, expect } from 'bun:test';
import { LinkedListNode } from './linked-list-node';

describe('LinkedListNode', () => {
  test('creates list node with value', () => {
    const node = new LinkedListNode<number>(1);

    expect(node.value).toEqual(1);
    expect(node.next).toBeNull();
  });

  test('creates list node with object as a value', () => {
    const nodeValue = {
      value: 1,
      key: 'test',
    };

    const node = new LinkedListNode<typeof nodeValue>(nodeValue);

    expect(node.value.value).toEqual(1);
    expect(node.value.key).toEqual('test');
    expect(node.next).toBeNull();
  });

  test('links nodes together', () => {
    const node2 = new LinkedListNode<number>(1);
    const node1 = new LinkedListNode<number>(2, node2);

    expect(node1.next).toBeDefined();
    expect(node2.next).toBeNull();
    expect(node1.value).toEqual(2);
    expect(node1.next?.value).toEqual(1);
  });

  test('converts node to string', () => {
    const node = new LinkedListNode(1);
    expect(node.toString()).toEqual('1');

    node.value = 'new value';
    expect(node.toString()).toEqual('new value');
  });
});
