import { DoublyLinkedListNode } from './doubly-linked-list-node';
import { Comparator } from '../utils/comparator';
import type { CompareFunction } from '../utils/comparator';

type NullableDoublyLinkedListNode<T> = DoublyLinkedListNode<T> | null;

export class DoublyLinkedList<T = any> {
  #head: NullableDoublyLinkedListNode<T> = null;

  #tail: NullableDoublyLinkedListNode<T> = null;

  #length: number = 0;

  #compare: Comparator<T>;

  constructor(compareFunction?: CompareFunction<T>) {
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

  toArray() {
    let nodes = [];
    let currentNode = this.#head;

    while (currentNode !== null) {
      nodes.push(currentNode.value);
      currentNode = currentNode.next;
    }

    return nodes;
  }
}
