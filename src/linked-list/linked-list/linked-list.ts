import { Comparator } from '../../utils/comparator';
import type { CompareFunction } from '../../utils/comparator';
import { LinkedListNode } from '../linked-list-node';
// import type { Callback } from '../linked-list-node';

type NullableLinkedListNode<T> = LinkedListNode<T> | null;

type InsertAtOptions<T> = {
  value: T;
  index: number;
};

interface BasicMethods<T> {
  toArray(): T[];
  toString(): string;
  append(value: T): this;
  prepend(value: T): this;
  reverse(): this;
  delete(value: T): NullableLinkedListNode<T>;
  insertAt(options: InsertAtOptions<T>): this;
  deleteHead(): NullableLinkedListNode<T>;
  deleteTail(): NullableLinkedListNode<T>;
}

export interface LinkedListType<T> extends BasicMethods<T> {
  readonly head: NullableLinkedListNode<T>;
  readonly tail: NullableLinkedListNode<T>;
  readonly length: number;
  readonly isEmpty: boolean;
}

export class LinkedList<T = any> implements LinkedListType<T> {
  #head: NullableLinkedListNode<T>;

  #tail: NullableLinkedListNode<T>;

  #length: number;

  #compare;

  constructor(compareFunction?: CompareFunction<T>) {
    this.#head = null;
    this.#tail = null;
    this.#length = 0;
    this.#compare = new Comparator(compareFunction);
  }

  get isEmpty() {
    return this.#head === null;
  }

  get head() {
    return this.#head;
  }

  get tail() {
    return this.#tail;
  }

  get length(): number {
    return this.#length;
  }

  toArray() {
    const array = [];
    let currentNode = this.#head;

    while (currentNode) {
      array.push(currentNode.value);
      currentNode = currentNode.next;
    }

    return array;
  }

  toString() {
    return this.toArray().toString();
  }

  append(value: T) {
    const newNode = new LinkedListNode(value);

    if (this.#head === null) {
      this.#head = newNode;
      this.#tail = newNode;
    } else {
      this.#tail!.next = newNode;
      this.#tail = newNode;
    }

    this.#length += 1;

    return this;
  }

  prepend(value: T) {
    const newNode = new LinkedListNode(value);

    if (this.#head === null) {
      this.#head = newNode;
      this.#tail = newNode;
    } else {
      newNode.next = this.#head;
      this.#head = newNode;
    }

    this.#length += 1;

    return this;
  }

  delete(value: T) {
    if (this.#head === null) return null;
    let deletedNode = null;

    // at the beginning of the list
    if (this.#head && this.#compare.equal(value, this.#head.value)) {
      deletedNode = this.#head;
      this.#length -= 1;

      this.#head = deletedNode.next;
    }

    let currentNode = this.#head;

    while (currentNode?.next) {
      if (this.#compare.equal(currentNode.next.value, value)) {
        deletedNode = currentNode.next;
        this.#length -= 1;

        currentNode.next = deletedNode.next;
      } else {
        currentNode = currentNode.next;
      }
    }

    // at the end of the list
    if (this.#tail && this.#compare.equal(value, this.#tail.value)) {
      this.#tail = currentNode;
    }

    return deletedNode;
  }

  reverse() {
    // if list empty or has a single node.
    if (this.#head === null || this.#head.next === null) return this;

    let currentNode = this.#head as NullableLinkedListNode<T>;
    let prevNode = null;

    while (currentNode) {
      const nextNode = currentNode.next;
      currentNode.next = prevNode;
      prevNode = currentNode;
      currentNode = nextNode;
    }

    this.#tail = this.#head;
    this.#head = prevNode;

    return this;
  }

  #findNodeByIndex(index: number): LinkedListNode<T> {
    let node = this.#head!;

    for (let i = 0; i < index; i += 1) {
      node = node.next!;
    }

    return node;
  }

  insertAt({ value, index }: InsertAtOptions<T>): this {
    if (index < 0 || index > this.#length) {
      throw new Error(
        'Index should be greater than or equal to 0 and less than or equal to the list length.',
      );
    }

    // at the beginning
    if (index === 0) {
      this.prepend(value);

      return this;
    }

    // at the end
    if (index === this.#length) {
      this.append(value);

      return this;
    }

    // in the middle
    const prevNode = this.#findNodeByIndex(index - 1);
    const newNode = new LinkedListNode(value);

    newNode.next = prevNode.next;
    prevNode.next = newNode;

    this.#length += 1;

    return this;
  }

  deleteHead() {
    if (this.#head === null) return null;

    const deletedNode = this.#head;

    if (this.#head.next) {
      this.#head = this.#head.next;
    } else {
      this.#head = null;
      this.#tail = null;
    }

    this.#length -= 1;

    return deletedNode;
  }

  deleteTail() {
    if (this.#tail === null) return null;

    const deletedTail = this.#tail;

    // where is a single node
    if (this.#head === this.#tail) {
      this.#head = null;
      this.#tail = null;

      this.#length -= 1;

      return deletedTail;
    }

    // where are multiple nodes
    let currentNode = this.#head as NullableLinkedListNode<T>;

    while (currentNode?.next) {
      if (currentNode.next.next === null) {
        currentNode.next = null;
      } else {
        currentNode = currentNode.next;
      }
    }

    this.#tail = currentNode;

    return deletedTail;
  }
}
