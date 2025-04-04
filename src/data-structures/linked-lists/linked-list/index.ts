import {
  AbstractLinkedList,
  ListNode,
  type Predicate,
} from '@/shared/abstract-linked-list/abstract-linked-list';
import { type Nullable } from '@/shared/types';

export class LinkedList<T = any> extends AbstractLinkedList<T> {
  static of<T>(value: T) {
    const list = new LinkedList<T>();

    return list.append(value);
  }

  static fromArray<T>(array: T[]) {
    const list = new LinkedList<T>();

    array.forEach((value) => {
      list.append(value);
    });

    return list;
  }

  append(value: T) {
    const newNode = new ListNode(value);

    if (!this._head) {
      this._initializeList(newNode);
    } else {
      this._tail!.next = newNode;
      this._tail = newNode;

      this._increaseSize();
    }

    return this;
  }

  prepend(value: T) {
    const newNode = new ListNode(value);

    if (!this._head) {
      this._initializeList(newNode);
    } else {
      newNode.next = this._head;
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
    } else if (index === this._size) {
      // At the end.
      this.append(value);
    } else {
      // In the middle.
      const prevNode = this._findNodeByIndex(index - 1);
      const newNode = new ListNode(value);

      newNode.next = prevNode.next;
      prevNode.next = newNode;

      this._increaseSize();
    }

    return this;
  }

  removeByValue(value: T): Nullable<ListNode>;
  removeByValue(predicate: Predicate<T>): Nullable<ListNode>;
  removeByValue(arg: T | Predicate<T>) {
    if (!this._head) return null;

    let removedNode: Nullable<ListNode> = null;
    let prevNode: Nullable<ListNode> = null;

    for (const currentNode of this) {
      if (this._isMatch(currentNode.data, arg)) {
        removedNode = currentNode as ListNode;

        break;
      }

      prevNode = currentNode as ListNode;
    }

    if (!removedNode) return null;

    if (prevNode === null) {
      this._head = removedNode.next;
    } else {
      prevNode.next = removedNode.next;
    }

    if (removedNode.next === null) {
      this._tail = prevNode;
    }

    removedNode.next = null;
    this._decreaseSize();

    return removedNode;
  }

  removeHead() {
    if (!this._head) return null;

    const removedNode = this._head;

    if (removedNode?.next) {
      this._head = removedNode.next;
      removedNode.next = null;

      this._decreaseSize();
    } else {
      this.clear();
    }

    return removedNode;
  }

  removeTail() {
    if (!this._head) return null;

    const removedNode = this._tail;

    if (!this._head.next) {
      this.clear();
    } else {
      let prevNode: Nullable<ListNode> = null;
      let current = this._head;

      while (current.next) {
        prevNode = current;
        current = current.next;
      }

      prevNode!.next = null;
      this._tail = prevNode;
      this._decreaseSize();
    }

    return removedNode;
  }

  reverse() {
    if (!this._head || !this._head.next) {
      return this;
    }

    let current: Nullable<ListNode> = this._head;
    let prev = null;

    while (current) {
      const nextNode = current.next;
      current.next = prev;
      prev = current;

      current = nextNode as ListNode;
    }

    this._tail = this._head;
    this._head = prev;

    return this;
  }

  get [Symbol.toStringTag]() {
    return `${this.constructor.name}`;
  }
}
