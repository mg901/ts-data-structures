import { DoublyLinkedListNode } from './doubly-linked-list-node';

type NullableDoublyLinkedListNode<T> = DoublyLinkedListNode<T> | null;

export interface IDoublyLinkedList<T = any> {
  readonly head: NullableDoublyLinkedListNode<T>;
  readonly tail: NullableDoublyLinkedListNode<T>;
  readonly length: number;
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
}
