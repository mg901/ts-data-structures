import { BaseLinkedList, Predicate } from '@/shared/base-linked-list';
import { DoublyLinkedListNode as Node } from './node';

export class DoublyLinkedList<T = any> extends BaseLinkedList<T, Node<T>> {
  // eslint-disable-next-line class-methods-use-this
  get [Symbol.toStringTag]() {
    return 'DoublyLinkedList';
  }

  append(value: T) {
    const newNode = new Node(value);

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
    const newNode = new Node(value);

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

  delete(value: T): Node<T> | null;
  delete(predicate: Predicate<T>): Node<T> | null;
  delete(arg: T | Predicate<T>) {
    if (this._head === null) return null;

    let deletedNode: Node | null = null;

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

  reverse() {
    if (this._head === null || this._head.next === null) {
      return this;
    }

    let prevNode = null;
    let currentNode = this._head as Node | null;

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
      let newNode = new Node(value);
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
