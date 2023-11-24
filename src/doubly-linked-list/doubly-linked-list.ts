import { DoublyLinkedListNode } from './doubly-linked-list-node';
import { Comparator } from '../utils/comparator';
import type { CompareFunction } from '../utils/comparator';

type NullableDoublyLinkedListNode<T> = DoublyLinkedListNode<T> | null;

export class DoublyLinkedList<T = any> {
  #head: NullableDoublyLinkedListNode<T> = null;

  #tail: NullableDoublyLinkedListNode<T> = null;

  #compare: Comparator<T>;

  constructor(compareFunction?: CompareFunction<T>) {
    this.#compare = new Comparator(compareFunction);
  }
}
