import { DoublyLinkedListNode } from './doubly-linked-list-node';
import { Comparator } from '../utils/comparator';
import type { IComparator, CompareFunction } from '../utils/comparator';

type NullableDoublyLinkedListNode<T = any> = DoublyLinkedListNode<T> | null;

type FindMethodOptions<T = any> = {
  value?: T;
  predicate?: (value: T) => boolean;
};

export interface IDoublyLinkedList<T = any> {
  readonly head: NullableDoublyLinkedListNode<T>;
  readonly tail: NullableDoublyLinkedListNode<T>;
  readonly length: number;
  readonly isEmpty: boolean;

  append(value: T): this;
  fromArray(array: T[]): this;
  toArray(): T[];
  toString(): string;
  prepend(value: T): this;
  delete(value: T): NullableDoublyLinkedListNode<T>;
  reverse(): this;
  insertAt(index: number, value: T): this;
  deleteHead(): NullableDoublyLinkedListNode<T>;
  deleteTail(): NullableDoublyLinkedListNode<T>;
  indexOf(value: T): number;
  find(options: FindMethodOptions<T>): NullableDoublyLinkedListNode<T>;
}

export class DoublyLinkedList<T = any> implements IDoublyLinkedList<T> {
  #head: NullableDoublyLinkedListNode<T>;

  #tail: NullableDoublyLinkedListNode<T>;

  #length: number;

  #compare: IComparator<T>;

  constructor(compareFunction?: CompareFunction<T>) {
    this.#head = null;
    this.#tail = null;
    this.#length = 0;
    this.#compare = new Comparator(compareFunction);
  }

  get head() {
    return this.#head;
  }

  get tail() {
    return this.#tail;
  }

  get length() {
    return this.#length;
  }

  get isEmpty() {
    return this.#head === null;
  }

  append(value: T) {
    const newNode = new DoublyLinkedListNode(value);

    if (this.#head === null) {
      this.#head = newNode;
      this.#tail = newNode;
    } else {
      newNode.prev = this.#tail;
      this.#tail!.next = newNode;
      this.#tail = newNode;
    }

    this.#length += 1;

    return this;
  }

  fromArray(array: T[]) {
    array.forEach((value) => {
      this.append(value);
    });

    return this;
  }

  toArray() {
    let array = [];
    let currentNode = this.#head;

    while (currentNode !== null) {
      array.push(currentNode.value);
      currentNode = currentNode.next;
    }

    return array;
  }

  toString() {
    return this.toArray().toString();
  }

  prepend(value: T) {
    const newNode = new DoublyLinkedListNode(value);

    if (this.#head === null) {
      this.#head = newNode;
      this.#tail = newNode;
    } else {
      newNode.next = this.#head;
      this.#head.prev = newNode;
      this.#head = newNode;
    }

    this.#length += 1;

    return this;
  }

  delete(value: T) {
    if (this.#head === null) return null;

    let deletedNode = null as NullableDoublyLinkedListNode;

    // Delete from the beginning of the list.
    if (this.#compare.equal(value, this.#head.value)) {
      deletedNode = this.#head;
      this.#head = deletedNode.next;

      // Update tail if the list becomes empty.
      if (this.#head === null) {
        this.#tail = null;
      } else {
        this.#head.prev = null;
      }
    } else {
      let currentNode = this.#head;

      // Search for the node by value.
      while (
        currentNode.next &&
        !this.#compare.equal(value, currentNode.next.value)
      ) {
        currentNode = currentNode.next;
      }

      // Delete the node from the middle.
      if (currentNode.next !== null) {
        deletedNode = currentNode.next;
        currentNode.next = deletedNode.next;

        if (currentNode.next === null) {
          this.#tail = currentNode;
        } else {
          currentNode.next.prev = currentNode;
        }
      }
    }

    if (deletedNode) {
      this.#length -= 1;
    }

    return deletedNode;
  }

  reverse() {
    if (this.#head === null || this.#head.next === null) {
      return this;
    }

    let prevNode = null;
    let currentNode = this.#head as NullableDoublyLinkedListNode;

    while (currentNode !== null) {
      const nextNode = currentNode.next;
      currentNode.next = prevNode;
      currentNode.prev = nextNode;
      prevNode = currentNode;

      currentNode = nextNode;
    }

    this.#tail = this.#head;
    this.#head = prevNode;

    return this;
  }

  #findNodeByIndex(index: number) {
    let currentNode = this.#head!;

    for (let i = 0; i < index; i += 1) {
      currentNode = currentNode.next!;
    }

    return currentNode;
  }

  insertAt(index: number, value: T) {
    const isInvalidIndex = index < 0 || index > this.#length;

    if (isInvalidIndex) {
      throw new Error(
        'Index should be greater than or equal to 0 and less than or equal to the list length.',
      );
    }

    if (index === 0) {
      // Insert at the beginning.
      this.prepend(value);
      // Insert at the end.
    } else if (index === this.#length) {
      this.append(value);
    } else {
      // Insert in the middle.
      let prevNode = this.#findNodeByIndex(index - 1);
      let newNode = new DoublyLinkedListNode(value);
      newNode.next = prevNode.next;
      newNode.prev = prevNode;
      prevNode.next = newNode;

      this.#length += 1;
    }

    return this;
  }

  deleteHead() {
    if (this.#head === null) return null;

    const deletedNode = this.#head;

    if (deletedNode?.next) {
      this.#head = deletedNode.next;
      this.#head.prev = null;
    } else {
      this.#head = null;
      this.#tail = null;
    }

    this.#length -= 1;

    return deletedNode;
  }

  deleteTail() {
    if (this.#head === null) return null;

    let deletedNode = this.#tail;

    // If there is only one node.
    if (this.#head === this.#tail) {
      this.#head = null;
      this.#tail = null;
    } else {
      // If multiple nodes.
      let currentNode = this.#head;

      while (currentNode.next?.next) {
        currentNode = currentNode.next;
      }

      currentNode.next = null;
      this.#tail = currentNode;
    }

    this.#length -= 1;

    return deletedNode;
  }

  indexOf(value: T) {
    let count = 0;
    let currentNode = this.#head;

    while (currentNode !== null) {
      if (this.#compare.equal(value, currentNode.value)) return count;

      currentNode = currentNode.next;
      count += 1;
    }

    return -1;
  }

  find({ value, predicate }: FindMethodOptions<T>) {
    if (this.#head === null) return null;

    let currentNode = this.#head as NullableDoublyLinkedListNode;

    while (currentNode) {
      if (predicate && predicate(currentNode.value)) {
        return currentNode;
      }

      if (value && this.#compare.equal(value, currentNode.value)) {
        return currentNode;
      }

      currentNode = currentNode.next;
    }

    return null;
  }
}
