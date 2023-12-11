import { type NullableNode, Node } from './node';

export class DoublyLinkedList<Key = any, Value = any> {
  head: NullableNode<Key, Value> = null;

  tail: NullableNode<Key, Value> = null;

  length: number = 0;

  push(key: Key, value: Value): Node<Key, Value> {
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

  delete(node: Node<Key, Value>): void {
    if (this.head === this.tail) {
      this.head = null;
      this.tail = null;
    } else if (node === this.head) {
      this.head = this.head.next;
      this.head!.prev = null;
    } else if (node === this.tail) {
      this.tail = this.tail.prev;
      this.tail!.next = null;
    } else {
      node.prev!.next = node.next;
      node.next!.prev = node.prev;
    }

    this.length -= 1;
  }
}
