import { DoublyLinkedListNode } from './doubly-linked-list-node';

type NullableDoublyLinkedListNode<T = any> = DoublyLinkedListNode<T> | null;

export interface IDoublyLinkedList<T = any> {
  readonly head: NullableDoublyLinkedListNode<T>;
  readonly tail: NullableDoublyLinkedListNode<T>;
  readonly length: number;
  append(value: T): this;
  toArray(): T[];
  toString(): string;
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
}
