export type Callback<T> = (data: T) => string;

type NullableLinkedListNode<T> = LinkedListNode<T> | null;

export interface ILinkedListNode<T = any> {
  value: T;
  next?: NullableLinkedListNode<T>;
  toString(callback?: Callback<T>): string;
}

export class LinkedListNode<T = any> implements ILinkedListNode<T> {
  constructor(
    public value: T,
    public next: NullableLinkedListNode<T> = null,
  ) {
    this.value = value;
    this.next = next;
  }

  toString(callback?: Callback<T>) {
    return callback ? callback(this.value) : `${this.value}`;
  }
}
