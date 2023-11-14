import { Comparator } from '../../utils/comparator';
import type { CompareFunction } from '../../utils/comparator';
import { LinkedListNode } from '../linked-list-node';
// import type { Callback } from '../linked-list-node';

interface InsertMethodOptions<T = any> {
  value: T;
  index: number;
}

// interface FindMethodOptions<T = any> {
//   value?: T;
//   predicate?: (value: T) => boolean;
// }

type NullableLinkedList<T> = LinkedListNode<T> | null;

export class LinkedList<T = any> {
  #head: NullableLinkedList<T>;

  #tail: NullableLinkedList<T>;

  #length: number;

  #compare;

  constructor(compareFunction?: CompareFunction<T>) {
    this.#head = null;
    this.#tail = null;
    this.#length = 0;
    this.#compare = new Comparator(compareFunction);
  }

  get head(): NullableLinkedList<T> {
    return this.#head;
  }

  get tail(): NullableLinkedList<T> {
    return this.#tail;
  }

  get length(): number {
    return this.#length;
  }

  get isEmpty(): boolean {
    return this.#head === null;
  }

  toArray(): T[] {
    const array = [];
    let currentNode = this.#head;

    while (currentNode) {
      array.push(currentNode?.value);

      currentNode = currentNode.next;
    }

    return array;
  }

  toString(): string {
    return this.toArray().toString();
  }

  append(value: T): this {
    const newNode = new LinkedListNode<T>(value);

    if (this.isEmpty) {
      this.#head = newNode;
      this.#tail = newNode;
    } else {
      this.#tail!.next = newNode;
      this.#tail = newNode;
    }

    this.#length += 1;

    return this;
  }

  prepend(value: T): this {
    const newNode = new LinkedListNode<T>(value);

    if (this.isEmpty) {
      this.#head = newNode;
      this.#tail = newNode;
    } else {
      newNode.next = this.#head;
      this.#head = newNode;
    }

    this.#length += 1;

    return this;
  }

  reverse(): this {
    if (!this.#head || !this.#head.next) return this;

    let currentNode = this.#head as LinkedListNode<T> | null;
    let prevNode = null;

    while (currentNode) {
      const nextNode = currentNode.next;
      [currentNode.next, prevNode] = [prevNode, currentNode];

      currentNode = nextNode;
    }

    this.#tail = this.#head;
    this.#head = prevNode;

    return this;
  }

  delete(value: T): NullableLinkedList<T> {
    if (this.isEmpty) return null;

    let deletedNode = null;

    // at the beginning
    if (this.#head && this.#compare.equal(this.#head.value, value)) {
      deletedNode = this.#head;
      this.#head = this.#head.next;
      this.#length -= 1;
    }

    let currentNode = this.head;

    // do we have anything after the head removal?
    if (currentNode !== null) {
      while (currentNode.next) {
        // in the middle
        if (this.#compare.equal(value, currentNode.next.value)) {
          deletedNode = currentNode.next;
          this.#length -= 1;
          currentNode.next = currentNode.next.next;
        } else {
          currentNode = currentNode.next;
        }
      }
    }

    // at the end
    if (this.#compare.equal(this.#tail!.value, value)) {
      this.#tail = currentNode;
    }

    return deletedNode;
  }

  #findNodeByIndex(index: number): LinkedListNode<T> {
    let node = this.#head!;

    for (let i = 0; i < index; i += 1) {
      node = node.next!;
    }

    return node;
  }

  insertAt({ value, index }: InsertMethodOptions<T>): this {
    if (index < 0 || index > this.#length) {
      throw new Error(
        'Index should be greater than or equal to 0 and less than or equal to the list length.',
      );
    }

    // at the beginning
    if (index === 0) {
      this.prepend(value);
      // at the end
    } else if (index === this.#length) {
      this.append(value);
    } else {
      // in the middle
      const prevNode = this.#findNodeByIndex(index - 1);
      const newNode = new LinkedListNode(value);

      newNode.next = prevNode.next;
      prevNode.next = newNode;

      this.#length += 1;
    }

    return this;
  }
}
