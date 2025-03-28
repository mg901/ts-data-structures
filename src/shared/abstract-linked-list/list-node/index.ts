import { Node } from '@/shared/node';
import { Nullable } from '@/shared/types';

export class ListNode<T = any> extends Node<T> {
  next: Nullable<ListNode<T>>;

  constructor(data: T, next: Nullable<ListNode<T>> = null) {
    super(data);
    this.next = next;
  }
}
