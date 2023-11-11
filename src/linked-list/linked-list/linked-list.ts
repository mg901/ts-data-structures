import { Comparator } from '../../utils/comparator';
import type { CompareFunction } from '../../utils/comparator';
import { LinkedListNode } from '../linked-list-node';
import type { Callback } from '../linked-list-node';

interface FindMethodOptions<T = any> {
  data?: T;
  predicate?: (value: T) => boolean;
}

interface insertMethodOptions<T = any> {
  data: T;
  index: number;
}

export class LinkedList<T = any> {
  head: LinkedListNode<T> | null;

  tail: LinkedListNode<T> | null;

  length: number;

  #compare;

  constructor(compareFunction?: CompareFunction<T>) {
    this.head = null;
    this.tail = null;
    this.length = 0;
    this.#compare = new Comparator(compareFunction);
  }

  toArray() {
    if (this.isEmpty) return [];

    const nodes = [] as LinkedListNode<T>[];
    let currentNode = this.head as LinkedListNode<T> | null;

    while (currentNode) {
      nodes.push(currentNode);
      currentNode = currentNode.next;
    }

    return nodes;
  }

  toString(callback?: Callback<T>) {
    return this.toArray()
      .map((node) => node.toString(callback))
      .toString();
  }

  append(data: T) {
    const newNode = new LinkedListNode(data);
    this.length += 1;

    if (this.isEmpty) {
      this.head = newNode;
      this.tail = newNode;

      return this;
    }
    this.tail!.next = newNode;
    this.tail = newNode;

    return this;
  }

  prepend(data: T) {
    const newNode = new LinkedListNode(data, this.head);
    this.head = newNode;

    if (!this.tail) {
      this.tail = newNode;
    }

    this.length += 1;

    return this;
  }

  reverse() {
    if (!this.head || !this.head.next) return this.head;

    let currentNode = this.head as LinkedListNode<T> | null;
    let prevNode = null;

    while (currentNode) {
      const nextNode = currentNode.next;
      currentNode.next = prevNode;

      prevNode = currentNode;
      currentNode = nextNode;
    }

    this.tail = this.head;
    this.head = prevNode;

    return this;
  }

  delete(data: T) {
    if (this.isEmpty) return null;
    let deletedNode = null;

    while (this.head && this.#compare.equal(data, this.head.data)) {
      deletedNode = this.head;
      this.head = deletedNode.next;
      this.length -= 1;
    }

    let currentNode = this.head;

    if (currentNode !== null) {
      while (currentNode.next) {
        if (this.#compare.equal(currentNode.next.data, data)) {
          deletedNode = currentNode.next;
          currentNode.next = currentNode.next.next;
          this.length -= 1;
        } else {
          currentNode = currentNode.next;
        }
      }
    }

    if (this.#compare.equal(this.tail!.data, data)) {
      this.tail = currentNode;
    }

    return deletedNode;
  }

  #findNode(index: number) {
    let node = this.head;

    for (let i = 0; i < index; i += 1) {
      node = node!.next;
    }

    return node;
  }

  insertAt({ data, index }: insertMethodOptions) {
    if (index < 0 || index > this.length) {
      throw new Error(
        'Index should be greater than or equal to 0 and less than or equal to the list length.',
      );
    }

    if (index === 0) {
      this.prepend(data);
    } else if (index === this.length) {
      this.append(data);
    } else {
      const prevNode = this.#findNode(index - 1)!;
      const newNode = new LinkedListNode<T>(data);

      newNode.next = prevNode.next;
      prevNode.next = newNode;

      this.length += 1;
    }

    return this;
  }

  deleteHead() {
    if (!this.head) return null;

    const deletedHead = this.head;

    if (deletedHead.next) {
      this.head = deletedHead.next;
    } else {
      this.head = null;
      this.tail = null;
    }

    this.length -= 1;

    return deletedHead;
  }

  deleteTail() {
    if (!this.head) return null;

    const deletedTail = this.tail;

    if (this.head === deletedTail) {
      this.head = null;
      this.tail = null;
      this.length -= 1;

      return deletedTail;
    }

    let currentNode = this.head;

    while (currentNode.next) {
      if (!currentNode.next.next) {
        currentNode.next = null;
      } else {
        currentNode = currentNode.next;
      }
    }

    this.tail = currentNode;
    this.length -= 1;

    return deletedTail;
  }

  indexOf(data: T) {
    let count = 0;
    let currentNode = this.head;

    while (currentNode) {
      if (this.#compare.equal(currentNode.data, data)) {
        return count;
      }

      currentNode = currentNode.next;
      count += 1;
    }

    return -1;
  }

  fromArray(array: T[]) {
    array.forEach((value) => {
      this.append(value);
    });

    return this;
  }

  find({ data = undefined, predicate = undefined }: FindMethodOptions<T>) {
    if (this.isEmpty) return null;

    let currentNode = this.head as LinkedListNode<T> | null;

    while (currentNode) {
      if (predicate && predicate(currentNode.data)) {
        return currentNode;
      }

      if (data !== undefined && this.#compare.equal(currentNode.data, data)) {
        return currentNode;
      }

      currentNode = currentNode.next;
    }

    return null;
  }

  get isEmpty(): boolean {
    return this.head === null;
  }
}
