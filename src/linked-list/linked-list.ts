import { type CompareFunction, Comparator } from '@/shared/comparator';
import { type Callback } from '@/shared/types';
import {
  type NullableLinkedListNode,
  LinkedListNode,
} from './linked-list-node';

type FindMethodOptions<T = any> = {
  value?: T;
  predicate?: (value: T) => boolean;
};

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

  deleteByValue(value: T): NullableLinkedListNode<T> {
    if (this.#head === null) return null;

    let deletedNode: NullableLinkedListNode = null;

    // Delete from the beginning of the list.
    if (this.#compare.equal(value, this.#head.value)) {
      deletedNode = this.#head;
      this.#head = deletedNode.next;

      // Update tail if the list becomes empty.
      if (this.#head === null) {
        this.#tail = null;
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
        currentNode.next = deletedNode?.next;

        // Update tail if the last node is deleted.
        if (currentNode.next === null) {
          this.#tail = currentNode;
        }
      }
    }

    if (deletedNode) {
      // Clear the reference of the deleted node.
      deletedNode.next = null;
      this.#size -= 1;
    }

    return deletedNode;
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

  find({ value, predicate }: FindMethodOptions<T>): NullableLinkedListNode<T> {
    if (this.#head === null) return null;

    let currentNode: NullableLinkedListNode = this.#head;

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

  clear(): void {
    this.#head = null;
    this.#tail = null;
    this.#size = 0;
  }
}
