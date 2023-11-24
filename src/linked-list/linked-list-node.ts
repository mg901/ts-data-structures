export type Callback<T> = (data: T) => string;

type NullableLinkedListNode<T> = LinkedListNode<T> | null;

export class LinkedListNode<T = any> {
  constructor(
    public value: T,
    public next: NullableLinkedListNode<T> = null,
  ) {}

  toString(callback?: Callback<T>): string {
    return callback ? callback(this.value) : `${this.value}`;
  }
}
