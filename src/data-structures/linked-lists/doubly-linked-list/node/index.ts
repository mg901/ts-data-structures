import { LinkedListNode } from '@/shared/linked-list/node';
import { Nullable } from '@/shared/types';

export class DoublyLinkedListNode<T = any> extends LinkedListNode<T> {
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
