import { BaseLinkedListNode } from '@/shared/base-linked-list';

export class DoublyLinkedListNode<T = any> extends BaseLinkedListNode<T> {
  constructor(
    public value: T,
    public next: DoublyLinkedListNode<T> | null = null,
    public prev: DoublyLinkedListNode<T> | null = null,
  ) {
    super(value, next);
    this.prev = prev;
  }
}
