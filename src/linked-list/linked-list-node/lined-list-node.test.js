import { describe, it, expect } from 'bun:test';
import { LinkedListNode } from './linked-list-node';

describe('LinkedListNode', () => {
  it('should create list node with value', () => {
    const node = new LinkedListNode(1);

    expect(node.data).toEqual(1);
    expect(node.next).toBeNull();
  });

  it('should create list node with object as a value', () => {
    const nodeValue = {
      value: 1,
      key: 'test',
    };
    const node = new LinkedListNode(nodeValue);

    expect(node.data.value).toEqual(1);
    expect(node.data.key).toEqual('test');
    expect(node.next).toBeNull();
  });

  it('should link nodes together', () => {
    const node2 = new LinkedListNode(1);
    const node1 = new LinkedListNode(2, node2);

    expect(node1.next).toBeDefined();
    expect(node2.next).toBeNull();
    expect(node1.data).toEqual(2);
    expect(node1.next.data).toEqual(1);
  });

  it('should convert node to string', () => {
    const node = new LinkedListNode(1);
    expect(node.toString()).toEqual('1');

    node.data = 'new value';
    expect(node.toString()).toEqual('new value');
  });
});
