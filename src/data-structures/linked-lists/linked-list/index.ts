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

    if (this.isEmpty) {
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

    if (this.isEmpty) {
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

  deleteByValue(value: T): Nullable<ListNode>;
  deleteByValue(predicate: Predicate<T>): Nullable<ListNode>;
  deleteByValue(arg: T | Predicate<T>) {
    if (this.isEmpty) return null;

    let deletedNode: Nullable<ListNode> = null;
    let prevNode: Nullable<ListNode> = null;

    for (const currentNode of this) {
      if (this._isMatch(currentNode.data, arg)) {
        deletedNode = currentNode as ListNode;

        break;
      }

      prevNode = currentNode as ListNode;
    }

    if (!deletedNode) return null;

    if (prevNode === null) {
      this._head = deletedNode.next;
    } else {
      prevNode.next = deletedNode.next;
    }

    if (deletedNode.next === null) {
      this._tail = prevNode;
    }

    deletedNode.next = null;
    this._decreaseSize();

    return deletedNode;
  }

  deleteHead() {
    if (this.isEmpty) return null;

    const deletedNode = this._head;

    if (deletedNode?.next) {
      this._head = deletedNode.next;
      deletedNode.next = null;

      this._decreaseSize();
    } else {
      this.clear();
    }

    return deletedNode;
  }

  deleteTail() {
    if (this._head === null) return null;

    const deletedNode = this._tail;

    // If only one node.
    if (this._head.next) {
      // // If there are multiple nodes.
      let prevNode: Nullable<ListNode> = null;

      for (const node of this) {
        if (node.next) {
          prevNode = node as ListNode;
        } else {
          prevNode!.next = null;
          this._tail = prevNode;
          this._decreaseSize();

          break;
        }
      }
    } else {
      this.clear();
    }

    return deletedNode;
  }

  reverse() {
    if (this._head === null || this._head.next === null) {
      return this;
    }

    let current = this._head as Nullable<ListNode>;
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
