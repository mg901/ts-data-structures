import {
  AbstractLinkedList,
  type Predicate,
} from '@/shared/abstract-linked-list/abstract-linked-list';
import { Nullable } from '@/shared/types';
import { DoublyLinkedListNode } from './node';

export { DoublyLinkedListNode };

export class DoublyLinkedList<T = any> extends AbstractLinkedList<
  T,
  DoublyLinkedListNode<T>
> {
  static of<T>(value: T) {
    const list = new DoublyLinkedList<T>();

    return list.append(value);
  }

  static fromArray<T>(array: T[]) {
    const list = new DoublyLinkedList<T>();
    array.forEach((value) => {
      list.append(value);
    });

    return list;
  }

  append(value: T) {
    const newNode = new DoublyLinkedListNode(value);

    if (!this._head) {
      this._initializeList(newNode);
    } else {
      this._tail!.next = newNode;
      newNode.prev = this._tail;
      this._tail = newNode;

      this._increaseSize();
    }

    return this;
  }

  prepend(value: T) {
    const newNode = new DoublyLinkedListNode(value);

    if (!this._head) {
      this._initializeList(newNode);
    } else {
      newNode.next = this._head;
      this._head.prev = newNode;
      this._head = newNode;

      this._increaseSize();
    }

    return this;
  }

  insertAt(index: number, value: T) {
    this._throwIsInvalidIndex(index);

    if (index === 0) {
      // At the beginning.
      this.prepend(value);
      // At the end.
    } else if (index === this._size) {
      this.append(value);
    } else {
      // In the middle.
      let prevNode = this._findNodeByIndex(index - 1);
      let newNode = new DoublyLinkedListNode(value);
      newNode.next = prevNode.next;
      newNode.prev = prevNode;
      prevNode.next = newNode;

      this._increaseSize();
    }

    return this;
  }

  removeByValue(value: T): Nullable<DoublyLinkedListNode>;
  removeByValue(predicate: Predicate<T>): Nullable<DoublyLinkedListNode>;
  removeByValue(arg: T | Predicate<T>) {
    if (!this._head) return null;

    let removedNode: Nullable<DoublyLinkedListNode> = null;

    for (const currentNode of this) {
      if (this._isMatch(currentNode.data, arg)) {
        removedNode = currentNode;

        break;
      }
    }

    if (!removedNode) return null;

    // In the middle.
    if (removedNode.prev) {
      removedNode.prev.next = removedNode.next;
    } else {
      // At the beginning.
      this._head = removedNode.next as DoublyLinkedListNode;
    }

    // In the middle.
    if (removedNode.next) {
      removedNode.next.prev = removedNode.prev;
    } else {
      // At the end.
      this._tail = removedNode.prev as DoublyLinkedListNode;
    }

    removedNode.next = null;
    removedNode.prev = null;

    this._decreaseSize();

    return removedNode;
  }

  deleteByRef(ref: DoublyLinkedListNode<T>) {
    // In the middle.
    if (ref.prev) {
      ref.prev.next = ref.next;
    } else {
      // At the beginning.
      this._head = ref.next as DoublyLinkedListNode;
    }

    // In the middle.
    if (ref.next) {
      ref.next.prev = ref.prev;
    } else {
      // At the end.
      this._tail = ref.prev as DoublyLinkedListNode;
    }

    ref.next = null;
    ref.prev = null;

    this._decreaseSize();
  }

  removeHead() {
    if (!this._head) return null;

    const removedNode = this._head;

    if (removedNode?.next) {
      this._head = removedNode.next as DoublyLinkedListNode;
      this._head.prev = null;

      removedNode.next = null;
      this._decreaseSize();
    } else {
      this.clear();
    }

    return removedNode;
  }

  removeTail() {
    if (!this._head) return null;

    const removedNode = this.tail!;

    // If there is only one node.
    if (removedNode.prev) {
      this._tail = removedNode.prev! as DoublyLinkedListNode;
      this._tail.next = null;

      removedNode.prev = null;
      this._decreaseSize();
    } else {
      this.clear();
    }

    return removedNode;
  }

  reverse() {
    if (!this._head || !this._head.next) {
      return this;
    }

    let prev = null;
    let current: Nullable<DoublyLinkedListNode> = this._head;

    while (current !== null) {
      const nextNode = current.next;
      current.next = prev;
      current.prev = nextNode;
      prev = current;

      current = nextNode as DoublyLinkedListNode;
    }

    this._tail = this._head;
    this._head = prev;

    return this;
  }

  get [Symbol.toStringTag]() {
    return `${this.constructor.name}`;
  }
}
