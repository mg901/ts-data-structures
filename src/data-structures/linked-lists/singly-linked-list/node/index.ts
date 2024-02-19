import { Node } from '@/shared/node';

export class SinglyLinkedListNode<T = any> extends Node<T> {
  next: SinglyLinkedListNode<T> | null;

  constructor(data: T, next: SinglyLinkedListNode<T> | null = null) {
    super(data);
    this.next = next;
  }
}
