import { Node } from '@/shared/node';

export class DoublyLinkedListNode<T = any> extends Node<T> {
  next: DoublyLinkedListNode<T> | null;

  prev: DoublyLinkedListNode<T> | null;

  constructor(
    data: T,
    next: DoublyLinkedListNode<T> | null = null,
    prev: DoublyLinkedListNode<T> | null = null,
  ) {
    super(data);
    this.next = next;
    this.prev = prev;
  }
}
