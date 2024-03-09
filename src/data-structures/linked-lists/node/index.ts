import { Node } from '@/shared/node';
import { Nullable } from '@/shared/types';

export class LinkedListNode<T = any> extends Node<T> {
  next: Nullable<LinkedListNode<T>>;

  constructor(data: T, next: Nullable<LinkedListNode<T>> = null) {
    super(data);
    this.next = next;
  }
}
