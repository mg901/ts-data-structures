import { type CompareFunction, Comparator } from '@/shared/comparator';
import { type Callback } from '@/shared/types';
import {
  type NullableLinkedListNode,
  LinkedListNode,
} from './linked-list-node';

type SearchOptions<T> = T | { predicate?: (value: T) => boolean };

export class LinkedList<T = any> {
  #head: NullableLinkedListNode<T> = null;

  #tail: NullableLinkedListNode<T> = null;

  #size: number = 0;

  #compare: Comparator<T>;

  constructor(compareFunction?: CompareFunction<T>) {
    this.#compare = new Comparator(compareFunction);
  }

  get head(): NullableLinkedListNode<T> {
    return this.#head;
  }

  get tail(): NullableLinkedListNode<T> {
    return this.#tail;
  }

  get size(): number {
    return this.#size;
  }

  get isEmpty(): boolean {
    return this.#head === null;
  }

  #isMatch(nodeValue: T, options: SearchOptions<T>) {
    return typeof options === 'object' &&
      options !== null &&
      'predicate' in options &&
      options.predicate
      ? options.predicate(nodeValue)
      : this.#compare.equal(options as T, nodeValue);
  }

  append(value: T): this {
    const newNode = new LinkedListNode(value);

    if (this.#head === null) {
      this.#head = newNode;
      this.#tail = newNode;
    } else {
      this.#tail!.next = newNode;
      this.#tail = newNode;
    }

    this.#size += 1;

    return this;
  }

  fromArray(array: T[]): this {
    array.forEach((value) => {
      this.append(value);
    });

    return this;
  }

  [Symbol.iterator](): Iterator<LinkedListNode<T>> {
    let currentNode = this.#head;

    return {
      next() {
        if (currentNode !== null) {
          const value = currentNode;
          currentNode = currentNode.next;

          return {
            done: false,
            value,
          };
        }

        return {
          value: undefined as any,
          done: true,
        };
      },
    };
  }

  toArray(): T[] {
    let values = [];

    // eslint-disable-next-line no-restricted-syntax
    for (const node of this) {
      values.push(node.value);
    }

    return values;
  }

  toString(callback?: Callback<T>): string {
    let nodes = [];

    // eslint-disable-next-line no-restricted-syntax
    for (const node of this) {
      nodes.push(node);
    }

    return nodes.map((node) => node.toString(callback)).toString();
  }

  prepend(value: T): this {
    const newNode = new LinkedListNode(value);

    if (this.#head === null) {
      this.#head = newNode;
      this.#tail = newNode;
    } else {
      newNode.next = this.#head;
      this.#head = newNode;
    }

    this.#size += 1;

    return this;
  }

  delete(options: SearchOptions<T>): NullableLinkedListNode<T> {
    if (this.#head === null) return null;

    let deletedNode: NullableLinkedListNode = null;

    if (this.#isMatch(this.#head.value, options)) {
      deletedNode = this.#deleteHeadAndUpdateTail();
    } else {
      let currentNode = this.#head;

      while (
        currentNode.next &&
        !this.#isMatch(currentNode.next.value, options)
      ) {
        currentNode = currentNode.next;
      }

      deletedNode = this.#deleteNodeAndUpdateTail(currentNode);
    }

    this.#updateSize(deletedNode);

    return deletedNode;
  }

  #deleteHeadAndUpdateTail(): NullableLinkedListNode<T> {
    const deletedNode = this.#head;

    if (deletedNode?.next) {
      this.#head = deletedNode.next;
    } else {
      this.#head = null;
      this.#tail = null;
    }

    return deletedNode;
  }

  #deleteNodeAndUpdateTail(
    prevNode: LinkedListNode<T>,
  ): NullableLinkedListNode<T> {
    let deletedNode: NullableLinkedListNode<T> = null;

    // Delete the node from the middle.
    if (prevNode.next !== null) {
      deletedNode = prevNode.next;
      prevNode.next = deletedNode?.next;

      // Update tail if the last node is deleted.
      if (prevNode.next === null) {
        this.#tail = prevNode;
      }
    }

    return deletedNode;
  }

  #updateSize(deletedNode: NullableLinkedListNode) {
    if (deletedNode) {
      // Clear the reference of the deleted node.
      deletedNode.next = null;
      this.#size -= 1;
    }
  }

  reverse(): this {
    if (this.#head === null || this.#head.next === null) {
      return this;
    }

    let currentNode = this.#head as NullableLinkedListNode;
    let prevNode = null;

    while (currentNode !== null) {
      const nextNode = currentNode.next;
      currentNode.next = prevNode;
      prevNode = currentNode;

      currentNode = nextNode;
    }

    this.#tail = this.#head;
    this.#head = prevNode;

    return this;
  }

  insertAt(index: number, value: T): this {
    const isInvalidIndex = index < 0 || index > this.#size;

    if (isInvalidIndex) {
      throw new Error(
        'Index should be greater than or equal to 0 and less than or equal to the list length.',
      );
    }

    if (index === 0) {
      // Insert at the beginning.
      this.prepend(value);
    } else if (index === this.#size) {
      // Insert at the end.
      this.append(value);
    } else {
      // Insert in the middle.
      const prevNode = this.#findNodeByIndex(index - 1);
      const newNode = new LinkedListNode(value);

      newNode.next = prevNode.next;
      prevNode.next = newNode;

      this.#size += 1;
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

  deleteHead(): NullableLinkedListNode<T> {
    if (this.#head === null) return null;

    const deletedNode = this.#head;

    if (deletedNode?.next) {
      this.#head = deletedNode.next;
    } else {
      this.#head = null;
      this.#tail = null;
    }

    this.#size -= 1;

    return deletedNode;
  }

  deleteTail(): NullableLinkedListNode<T> {
    if (this.#head === null) return null;

    const deletedTail = this.#tail;

    // If there is only one node.
    if (this.#head === this.#tail) {
      this.#head = null;
      this.#tail = null;
    } else {
      // If multiple nodes.
      let currentNode = this.#head;

      while (currentNode?.next?.next) {
        currentNode = currentNode.next;
      }

      currentNode.next = null;
      this.#tail = currentNode;
    }

    this.#size -= 1;

    return deletedTail;
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

  find(options: SearchOptions<T>): NullableLinkedListNode<T> {
    if (this.#head === null) return null;

    let currentNode: NullableLinkedListNode = this.#head;

    while (currentNode) {
      if (this.#isMatch(currentNode.value, options)) {
        return currentNode;
      }

      currentNode = currentNode.next;
    }

    return null;
  }

  clear(): void {
    this.#head = null;
    this.#tail = null;
    this.#size = 0;
  }
}
