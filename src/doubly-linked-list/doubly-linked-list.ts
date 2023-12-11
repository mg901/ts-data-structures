import { DoublyLinkedListNode } from './doubly-linked-list-node';
import type { NullableDoublyLinkedListNode } from './doubly-linked-list-node';
import { Comparator } from '../shared/comparator';
import type { CompareFunction } from '../shared/comparator';

type FindMethodOptions<T = any> = {
  value?: T;
  predicate?: (value: T) => boolean;
};

export class DoublyLinkedList<T = any> {
  #head: NullableDoublyLinkedListNode<T> = null;

  #tail: NullableDoublyLinkedListNode<T> = null;

  #length: number = 0;

  #compare: Comparator<T>;

  constructor(compareFunction?: CompareFunction<T>) {
    this.#compare = new Comparator(compareFunction);
  }

  get head(): NullableDoublyLinkedListNode<T> {
    return this.#head;
  }

  get tail(): NullableDoublyLinkedListNode<T> {
    return this.#tail;
  }

  get length(): number {
    return this.#length;
  }

  get isEmpty(): boolean {
    return this.#head === null;
  }

  append(value: T): this {
    const newNode = new DoublyLinkedListNode(value);

    if (this.#head === null) {
      this.#head = newNode;
      this.#tail = newNode;
    } else {
      this.#tail!.next = newNode;
      newNode.prev = this.#tail;
      this.#tail = newNode;
    }

    this.#length += 1;

    return this;
  }

  fromArray(array: T[]): this {
    array.forEach((value) => {
      this.append(value);
    });

    return this;
  }

  toArray(): T[] {
    let array = [];
    let currentNode = this.#head;

    while (currentNode !== null) {
      array.push(currentNode.value);
      currentNode = currentNode.next;
    }

    return array;
  }

  toString(): string {
    return this.toArray().toString();
  }

  prepend(value: T): this {
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

  delete(value: T): NullableDoublyLinkedListNode<T> {
    if (this.#head === null) return null;

    let currentNode: NullableDoublyLinkedListNode = this.#head;

    // Search for the node by value.
    while (
      currentNode !== null &&
      !this.#compare.equal(value, currentNode.value)
    ) {
      currentNode = currentNode.next;
    }

    if (currentNode === null) return null;

    if (currentNode.prev !== null) {
      currentNode.prev.next = currentNode.next;
    } else {
      // Deleted node is the head;
      this.#head = currentNode.next;
    }

    // Delete the node from the middle.
    if (currentNode.next !== null) {
      currentNode.next.prev = currentNode.prev;
    } else {
      // Deleted node is the tail
      this.#tail = currentNode.prev;
    }

    // Clear the reference of the deleted node.
    currentNode.prev = null;
    currentNode.next = null;

    this.#length -= 1;

    return currentNode;
  }

  reverse(): this {
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

  insertAt(index: number, value: T): this {
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

  #findNodeByIndex(index: number) {
    let currentNode = this.#head!;

    for (let i = 0; i < index; i += 1) {
      currentNode = currentNode.next!;
    }

    return currentNode;
  }

  deleteHead(): NullableDoublyLinkedListNode<T> {
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

  deleteTail(): NullableDoublyLinkedListNode<T> {
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

  indexOf(value: T): number {
    let count = 0;
    let currentNode = this.#head;

    while (currentNode !== null) {
      if (this.#compare.equal(value, currentNode.value)) return count;

      currentNode = currentNode.next;
      count += 1;
    }

    return -1;
  }

  find({
    value,
    predicate,
  }: FindMethodOptions<T>): NullableDoublyLinkedListNode<T> {
    if (this.#head === null) return null;

    let currentNode: NullableDoublyLinkedListNode = this.#head;

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
