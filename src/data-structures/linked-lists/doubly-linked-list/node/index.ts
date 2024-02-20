import { Node } from '@/shared/node';
import { Nullable } from '@/shared/types';

export class DoublyLinkedListNode<T = any> extends Node<T> {
  next: Nullable<DoublyLinkedListNode>;

  prev: Nullable<DoublyLinkedListNode>;

  constructor(
    data: T,
    next: Nullable<DoublyLinkedListNode> = null,
    prev: Nullable<DoublyLinkedListNode> = null,
  ) {
    super(data);
    this.next = next;
    this.prev = prev;
  }
}
