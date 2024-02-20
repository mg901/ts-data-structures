import { Node } from '@/shared/node';
import { Nullable } from '@/shared/types';

export class SinglyLinkedListNode<T = any> extends Node<T> {
  next: Nullable<SinglyLinkedListNode<T>>;

  constructor(data: T, next: Nullable<SinglyLinkedListNode<T>> = null) {
    super(data);
    this.next = next;
  }
}
