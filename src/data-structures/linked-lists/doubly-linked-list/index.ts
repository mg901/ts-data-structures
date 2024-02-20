import {
  LinkedList,
  Predicate,
} from '@/data-structures/linked-lists/linked-list';
import { DoublyLinkedListNode } from './node';

export class DoublyLinkedList<T = any> extends LinkedList<
  T,
  DoublyLinkedListNode<T>
> {
  // eslint-disable-next-line class-methods-use-this
  get [Symbol.toStringTag]() {
    return 'DoublyLinkedList';
  }

  append(value: T) {
    const newNode = new DoublyLinkedListNode(value);

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
    const newNode = new DoublyLinkedListNode(value);

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

  deleteByValue(value: T): DoublyLinkedListNode<T> | null;
  deleteByValue(predicate: Predicate<T>): DoublyLinkedListNode<T> | null;
  deleteByValue(arg: T | Predicate<T>) {
    if (this._head === null) return null;

    let deletedNode: DoublyLinkedListNode | null = null;

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
      this._head = deletedNode.next;
    }

    // Delete the node from the middle.
    if (deletedNode.next !== null) {
      deletedNode.next.prev = deletedNode.prev;
    } else {
      // Deleted node is the tail
      this._tail = deletedNode.prev;
    }

    // Clear the reference of the deleted node.
    deletedNode.prev = null;
    deletedNode.next = null;

    this._size -= 1;

    return deletedNode;
  }

  deleteByNode(node: DoublyLinkedListNode) {
    if (this._head === this._tail) {
      this._head = null;
      this._tail = null;
    } else if (node === this._head && this._head?.next) {
      this._head = this._head.next;
      this._head.prev = null;
    } else if (node === this._tail && this._tail.prev) {
      this._tail = this._tail.prev;
      this._tail.next = null;
    } else {
      node.prev!.next = node.next;
      node.next!.prev = node.prev;
    }

    if (this._size > 0) {
      this._size -= 1;
    }
  }

  reverse() {
    if (this._head === null || this._head.next === null) {
      return this;
    }

    let prevNode = null;
    let currentNode = this._head as DoublyLinkedListNode | null;

    while (currentNode !== null) {
      const nextNode = currentNode.next;
      currentNode.next = prevNode;
      currentNode.prev = nextNode;
      prevNode = currentNode;

      currentNode = nextNode;
    }

    this._tail = this._head;
    this._head = prevNode;

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
      let newNode = new DoublyLinkedListNode(value);
      newNode.next = prevNode.next;
      newNode.prev = prevNode;
      prevNode.next = newNode;

      this._size += 1;
    }

    return this;
  }

  deleteHead() {
    if (this._head === null) return null;

    const deletedNode = this._head;

    if (deletedNode?.next) {
      this._head = deletedNode.next;
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

    this._tail = deletedNode.prev!;
    this._tail.next = null;

    this._size -= 1;

    return deletedNode;
  }
}
