import { type Callback } from '../shared/types';

export type NullableDoublyLinkedListNode<T = any> =
  DoublyLinkedListNode<T> | null;

export class DoublyLinkedListNode<T = any> {
  constructor(
    public value: T,
    public next: NullableDoublyLinkedListNode<T> = null,
    public prev: NullableDoublyLinkedListNode<T> = null,
  ) {}

  toString(callback?: Callback<T>): string {
    return callback ? callback(this.value) : `${this.value}`;
  }
}
