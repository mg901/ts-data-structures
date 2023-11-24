export type Callback<T> = (value: T) => string;

export class DoublyLinkedListNode<T = any> {
  constructor(
    public value: T,
    public next: DoublyLinkedListNode<T> | null = null,
    public prev: DoublyLinkedListNode<T> | null = null,
  ) {}

  toString(callback?: Callback<T>): string {
    return callback ? callback(this.value) : `${this.value}`;
  }
}
