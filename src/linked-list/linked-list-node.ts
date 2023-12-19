import { type Callback } from '@/shared/types';

export type NullableLinkedListNode<T = any> = LinkedListNode<T> | null;

export class LinkedListNode<T = any> {
  constructor(
    public value: T,
    public next: NullableLinkedListNode<T> = null,
  ) {}

  toString(callback?: Callback<T>): string {
    return callback ? callback(this.value) : `${this.value}`;
  }
}
