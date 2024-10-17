import {
  LinkedList,
  LinkedListNode,
  type Predicate,
} from '@/shared/linked-list/linked-list';
import { type Nullable } from '@/shared/types';

export class SinglyLinkedList<
  T = any,
  Node extends LinkedListNode<T> = LinkedListNode<T>,
> extends LinkedList<T> {
  append(value: T) {
    const newNode = new LinkedListNode(value);

    if (this.isEmpty) {
      this._initializeList(newNode);
    } else {
      this._tail!.next = newNode;
      this._tail = newNode;

      this._increaseSize();
    }

    return this;
  }

  fromArray(array: T[]) {
    array.forEach((value) => {
      this.append(value);
    });

    return this;
  }

  prepend(value: T) {
    const newNode = new LinkedListNode(value);

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
      const newNode = new LinkedListNode(value);

      newNode.next = prevNode.next;
      prevNode.next = newNode;

      this._increaseSize();
    }

    return this;
  }

  deleteByValue(value: T): Nullable<Node>;
  deleteByValue(predicate: Predicate<T>): Nullable<Node>;
  deleteByValue(arg: T | Predicate<T>) {
    if (this.isEmpty) return null;

    let deletedNode: Nullable<Node> = null;
    let prevNode: Nullable<Node> = null;

    for (const currentNode of this) {
      if (this._isMatch(currentNode.data, arg)) {
        deletedNode = currentNode as Node;

        break;
      }

      prevNode = currentNode as Node;
    }

    if (deletedNode) {
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
    }

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

    // // If there are multiple nodes.
    if (this._head !== this._tail) {
      let prevNode: Nullable<Node> = null;

      for (const node of this) {
        if (node.next) {
          prevNode = node as Node;
        } else {
          prevNode!.next = null;
          this._tail = prevNode;
          this._decreaseSize();

          break;
        }
      }
    } else {
      // If only one node.
      this.clear();
    }

    return deletedNode;
  }

  reverse() {
    if (this._head === null || this._head.next === null) {
      return this;
    }

    let current = this._head as Nullable<Node>;
    let prev = null;

    while (current) {
      const nextNode = current.next;
      current.next = prev;
      prev = current;

      current = nextNode as Node;
    }

    this._tail = this._head;
    this._head = prev;

    return this;
  }

  // eslint-disable-next-line class-methods-use-this
  get [Symbol.toStringTag]() {
    return 'SinglyLinkedList';
  }
}
