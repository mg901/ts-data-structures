import { Node } from '@/shared/node';

export class LinkedListNode<T = any> extends Node<T> {
  next: LinkedListNode<T> | null;

  constructor(data: T, next: LinkedListNode<T> | null = null) {
    super(data);
    this.next = next;
  }
}
