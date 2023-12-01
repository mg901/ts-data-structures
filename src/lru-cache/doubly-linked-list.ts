/* eslint-disable no-param-reassign */
import { Node } from './node';
import type { NullableNode } from './node';

export class DoublyLinkedList<K = any, V = any> {
  head: NullableNode<K, V> = null;

  tail: NullableNode<K, V> = null;

  length: number = 0;

  push(key: K, value: V): Node<K, V> {
    const newNode = new Node(key, value);

    if (this.head === null) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      this.tail!.next = newNode;
      newNode.prev = this.tail;
      this.tail = newNode;
    }

    this.length += 1;

    return newNode;
  }

  delete(node: Node<K, V>): void {
    if (this.head === this.tail) {
      this.head = null;
      this.tail = null;
    } else if (node === this.head) {
      this.head = this.head.next;
      if (this.head) {
        this.head.prev = null;
      }
    } else if (node === this.tail) {
      this.tail = this.tail.prev;
      if (this.tail) {
        this.tail.next = null;
      }
    } else {
      node.prev!.next = node.next;
      node.next!.prev = node.prev;
    }

    this.length -= 1;
  }
}
