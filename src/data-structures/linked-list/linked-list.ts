import { BaseLinkedList, type Predicate } from '@/shared/base-linked-list';
import { LinkedListNode as Node } from './linked-list-node';

export class LinkedList<T = any> extends BaseLinkedList<T, Node<T>> {
  append(value: T): this {
    const newNode = new Node(value);

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

  prepend(value: T): this {
    const newNode = new Node(value);

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

  delete(value: T): Node<T> | null;
  delete(predicate: Predicate<T>): Node<T> | null;
  delete(arg: T | Predicate<T>) {
    if (this._head === null) return null;

    let deletedNode: Node | null = null;

    if (this._isMatch(this._head.data, arg)) {
      deletedNode = this.#deleteHeadAndUpdateTail();
    } else {
      let currentNode = this._head;

      while (currentNode.next && !this._isMatch(currentNode.next.data, arg)) {
        currentNode = currentNode.next;
      }

      deletedNode = this.#deleteNodeAndUpdateTail(currentNode);
    }

    if (deletedNode) {
      // Clear the reference of the deleted node.
      deletedNode.next = null;
      this._size -= 1;
    }

    return deletedNode;
  }

  #deleteHeadAndUpdateTail() {
    const deletedNode = this._head;

    if (deletedNode?.next) {
      this._head = deletedNode.next;
    } else {
      this._head = null;
      this._tail = null;
    }

    return deletedNode;
  }

  #deleteNodeAndUpdateTail(prevNode: Node<T>) {
    let deletedNode: Node | null = null;

    // Delete the node from the middle.
    if (prevNode.next !== null) {
      deletedNode = prevNode.next;
      prevNode.next = deletedNode?.next;

      // Update tail if the last node is deleted.
      if (prevNode.next === null) {
        this._tail = prevNode;
      }
    }

    return deletedNode;
  }

  reverse() {
    if (this._head === null || this._head.next === null) {
      return this;
    }

    let currentNode = this._head as Node | null;
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
      throw new Error(
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
      const newNode = new Node(value);

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
      // If multiple nodes.
      let currentNode = this._head;

      while (currentNode?.next?.next) {
        currentNode = currentNode.next;
      }

      currentNode.next = null;
      this._tail = currentNode;
    }

    this._size -= 1;

    return deletedTail;
  }
}

const list = new LinkedList<number>();

list.append(1).append('1');
