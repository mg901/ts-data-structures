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

  deleteByValue(value: T): Nullable<DoublyLinkedListNode>;
  deleteByValue(predicate: Predicate<T>): Nullable<DoublyLinkedListNode>;
  deleteByValue(arg: T | Predicate<T>) {
    if (!this._head) return null;

    let deletedNode: Nullable<DoublyLinkedListNode> = null;

    for (const currentNode of this) {
      if (this._isMatch(currentNode.data, arg)) {
        deletedNode = currentNode;

        break;
      }
    }

    if (!deletedNode) return null;

    // In the middle.
    if (deletedNode.prev) {
      deletedNode.prev.next = deletedNode.next;
    } else {
      // At the beginning.
      this._head = deletedNode.next as DoublyLinkedListNode;
    }

    // In the middle.
    if (deletedNode.next) {
      deletedNode.next.prev = deletedNode.prev;
    } else {
      // At the end.
      this._tail = deletedNode.prev as DoublyLinkedListNode;
    }

    deletedNode.next = null;
    deletedNode.prev = null;

    this._decreaseSize();

    return deletedNode;
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

  deleteHead() {
    if (!this._head) return null;

    const deletedNode = this._head;

    if (deletedNode?.next) {
      this._head = deletedNode.next as DoublyLinkedListNode;
      this._head.prev = null;

      deletedNode.next = null;
      this._decreaseSize();
    } else {
      this.clear();
    }

    return deletedNode;
  }

  deleteTail() {
    if (!this._head) return null;

    const deletedNode = this.tail!;

    // If there is only one node.
    if (deletedNode.prev) {
      this._tail = deletedNode.prev! as DoublyLinkedListNode;
      this._tail.next = null;

      deletedNode.prev = null;
      this._decreaseSize();
    } else {
      this.clear();
    }

    return deletedNode;
  }

  reverse() {
    if (!this._head || !this._head.next) {
      return this;
    }

    let prev = null;
    let current = this._head as Nullable<DoublyLinkedListNode>;

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
