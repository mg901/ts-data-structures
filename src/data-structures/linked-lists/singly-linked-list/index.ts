import {
  LinkedList,
  type Predicate,
} from '@/data-structures/linked-lists/linked-list';
import { SinglyLinkedListNode } from '@/data-structures/linked-lists/singly-linked-list/node';
import { type Nullable } from '@/shared/types';

export class SinglyLinkedList<T = any> extends LinkedList<
  T,
  SinglyLinkedListNode<T>
> {
  append(value: T) {
    const newNode = new SinglyLinkedListNode(value);

    if (this._head === null) {
      this._head = newNode;
      this._tail = newNode;
    } else {
      this._tail!.next = newNode;
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
    const newNode = new SinglyLinkedListNode(value);

    if (this._head === null) {
      this._head = newNode;
      this._tail = newNode;
    } else {
      newNode.next = this._head;
      this._head = newNode;
    }

    this._size += 1;

    return this;
  }

  deleteByValue(value: T): Nullable<SinglyLinkedListNode<T>>;
  deleteByValue(predicate: Predicate<T>): Nullable<SinglyLinkedListNode<T>>;
  deleteByValue(arg: T | Predicate<T>) {
    if (this._head === null) return null;

    let deletedNode: Nullable<SinglyLinkedListNode<T>> = null;
    let prevNode: Nullable<SinglyLinkedListNode<T>> = null;

    for (const currentNode of this) {
      if (this._isMatch(currentNode.data, arg)) {
        deletedNode = currentNode;

        break;
      }

      prevNode = currentNode;
    }

    if (deletedNode) {
      this.#deleteNodeAndUpdateTail(deletedNode, prevNode);

      deletedNode.next = null;
      this._size -= 1;
    }

    return deletedNode;
  }

  #deleteNodeAndUpdateTail(
    deletedNode: SinglyLinkedListNode,
    prevNode: Nullable<SinglyLinkedListNode<T>>,
  ) {
    if (prevNode === null) {
      this._head = deletedNode.next;
    } else {
      prevNode.next = deletedNode.next;
    }

    if (deletedNode.next === null) {
      this._tail = prevNode;
    }
  }

  reverse() {
    if (this._head === null || this._head.next === null) {
      return this;
    }

    let currentNode = this._head as Nullable<SinglyLinkedListNode<T>>;
    let prevNode = null;

    while (currentNode !== null) {
      const nextNode = currentNode.next;
      currentNode.next = prevNode;
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
    } else if (index === this._size) {
      // Insert at the end.
      this.append(value);
    } else {
      // Insert in the middle.
      const prevNode = this._findNodeByIndex(index - 1);
      const newNode = new SinglyLinkedListNode(value);

      newNode.next = prevNode.next;
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
    } else {
      this._head = null;
      this._tail = null;
    }

    this._size -= 1;

    return deletedNode;
  }

  deleteTail() {
    if (this._head === null) return null;

    const deletedTail = this._tail;

    // If there is only one node.
    if (this._head === this._tail) {
      this._head = null;
      this._tail = null;
    } else {
      // // If multiple nodes.
      let prevNode: Nullable<SinglyLinkedListNode<T>> = null;

      for (const currentNode of this) {
        if (currentNode.next) {
          prevNode = currentNode;
        } else {
          prevNode!.next = null;
          this._tail = prevNode;

          break;
        }
      }
    }

    this._size -= 1;

    return deletedTail;
  }

  // eslint-disable-next-line class-methods-use-this
  get [Symbol.toStringTag]() {
    return 'SinglyLinkedList';
  }
}
