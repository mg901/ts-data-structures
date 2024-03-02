import { Node } from '@/shared/node';
import { Nullable } from '@/shared/types';

export class DoublyLinkedListNode<T = any> extends Node<T> {
  next: Nullable<DoublyLinkedListNode<T>>;

  prev: Nullable<DoublyLinkedListNode<T>>;

  constructor(
    data: T,
    next: Nullable<DoublyLinkedListNode<T>> = null,
    prev: Nullable<DoublyLinkedListNode<T>> = null,
  ) {
    super(data);
    this.next = next;
    this.prev = prev;
  }
}
