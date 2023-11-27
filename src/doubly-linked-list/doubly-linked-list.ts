import { DoublyLinkedListNode } from './doubly-linked-list-node';

type NullableDoublyLinkedListNode<T = any> = DoublyLinkedListNode<T> | null;

export interface IDoublyLinkedList<T = any> {
  readonly head: NullableDoublyLinkedListNode<T>;
  readonly tail: NullableDoublyLinkedListNode<T>;
  readonly length: number;
  append(value: T): this;
  toArray(): T[];
  toString(): string;
  prepend(value: T): this;
  delete(value: T): NullableDoublyLinkedListNode<T>;
  reverse(): this;
  insertAt(index: number, value: T): this;
}

export class DoublyLinkedList<T = any> implements IDoublyLinkedList<T> {
  #head: NullableDoublyLinkedListNode<T>;

  #tail: NullableDoublyLinkedListNode<T>;

  #length: number;

  constructor() {
    this.#head = null;
    this.#tail = null;
    this.#length = 0;
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
    if (value === this.#head.value) {
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
      while (currentNode.next && value !== currentNode.next.value) {
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
}
