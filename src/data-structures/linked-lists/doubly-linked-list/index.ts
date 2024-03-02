// eslint-disable-next-line max-classes-per-file
import {
  LinkedList,
  type LinkedListOptions,
  type Predicate,
} from '@/data-structures/linked-lists/linked-list';

import { Nullable } from '@/shared/types';
import { DoublyLinkedListNode } from './node';

export { DoublyLinkedListNode };

export class DoublyLinkedList<
  T = any,
  Node extends DoublyLinkedListNode<T> = DoublyLinkedListNode<T>,
> extends LinkedList<T, Node> {
  #NodeInstance: new (data: T) => DoublyLinkedListNode<T>;

  constructor(options: LinkedListOptions<T, Node> = {}) {
    super(options?.compareFunction);
    this.#NodeInstance = options.NodeInstance ?? DoublyLinkedListNode;
  }

  append(value: T) {
    const newNode = new this.#NodeInstance(value) as Node;

    if (this._head === null) {
      this._head = newNode;
      this._tail = newNode;
    } else {
      this._tail!.next = newNode;
      newNode.prev = this._tail;
      this._tail = newNode;
    }

    this._size += 1;

    return this;
  }

  fromArray(array: T[]) {
    array.forEach((value) => {
      this.append(value);
    });

    return this;
  }

  prepend(value: T) {
    const newNode = new this.#NodeInstance(value) as Node;

    if (this._head === null) {
      this._head = newNode;
      this._tail = newNode;
    } else {
      newNode.next = this._head;
      this._head.prev = newNode;
      this._head = newNode;
    }

    this._size += 1;

    return this;
  }

  insertAt(index: number, value: T) {
    const isInvalidIndex = index < 0 || index > this._size;

    if (isInvalidIndex) {
      throw new RangeError(
        'Index should be greater than or equal to 0 and less than or equal to the list length.',
      );
    }

    if (index === 0) {
      // Insert at the beginning.
      this.prepend(value);
      // Insert at the end.
    } else if (index === this._size) {
      this.append(value);
    } else {
      // Insert in the middle.
      let prevNode = this._findNodeByIndex(index - 1);
      let newNode = new this.#NodeInstance(value);
      newNode.next = prevNode.next;
      newNode.prev = prevNode;
      prevNode.next = newNode;

      this._size += 1;
    }

    return this;
  }

  deleteByValue(value: T): Nullable<Node>;
  deleteByValue(predicate: Predicate<T>): Nullable<Node>;
  deleteByValue(arg: T | Predicate<T>) {
    if (this._head === null) return null;

    let deletedNode: Nullable<Node> = null;

    for (const currentNode of this) {
      if (this._isMatch(currentNode.data, arg)) {
        deletedNode = currentNode;

        break;
      }
    }

    if (deletedNode === null) return null;

    if (deletedNode.prev !== null) {
      deletedNode.prev.next = deletedNode.next;
    } else {
      // Deleted node is the head;
      this._head = deletedNode.next as Node;
    }

    // Delete the node from the middle.
    if (deletedNode.next !== null) {
      deletedNode.next.prev = deletedNode.prev;
    } else {
      // Deleted node is the tail
      this._tail = deletedNode.prev as Node;
    }

    // Clear the reference of the deleted node.
    deletedNode.prev = null;
    deletedNode.next = null;

    this._size -= 1;

    return deletedNode;
  }

  deleteByRef(ref: Node) {
    if (ref.next) {
      // In the middle or at the beginning.
      ref.next.prev = ref.prev;
    } else {
      this._tail = ref.prev as Node;
      // Contains one node or at the end.
    }

    if (ref.prev) {
      // At the end or in the middle.
      ref.prev.next = ref.next;
    } else {
      // Contains one node or at the beginning.
      this._head = ref.next as Node;
    }

    ref!.next = null;
    ref!.prev = null;

    this._size -= 1;
  }

  deleteHead() {
    if (this._head === null) return null;

    const deletedNode = this._head;

    if (deletedNode?.next) {
      this._head = deletedNode.next as Node;
      this._head.prev = null;
    } else {
      this._head = null;
      this._tail = null;
    }

    this._size -= 1;

    return deletedNode;
  }

  deleteTail() {
    if (this._head === null) return null;

    // If there is only one node.
    if (this._head === this._tail) {
      const deletedNode = this._tail;
      this._head = null;
      this._tail = null;

      this._size -= 1;

      return deletedNode;
    }

    const deletedNode = this.tail!;

    this._tail = deletedNode.prev! as Node;
    this._tail.next = null;

    this._size -= 1;

    return deletedNode;
  }

  reverse() {
    if (this._head === null || this._head.next === null) {
      return this;
    }

    let prevNode = null;
    let currentNode = this._head as Nullable<Node>;

    while (currentNode !== null) {
      const nextNode = currentNode.next;
      currentNode.next = prevNode;
      currentNode.prev = nextNode;
      prevNode = currentNode;

      currentNode = nextNode as Node;
    }

    this._tail = this._head;
    this._head = prevNode;

    return this;
  }

  // eslint-disable-next-line class-methods-use-this
  get [Symbol.toStringTag]() {
    return 'DoublyLinkedList';
  }
}
