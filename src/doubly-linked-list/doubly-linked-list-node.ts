export type Callback<T> = (value: T) => string;

interface IDoublyLinkedListNode<T = any> {
  value: T;
  prev: IDoublyLinkedListNode<T> | null;
  next: IDoublyLinkedListNode<T> | null;
  toString(callback?: Callback<T>): string;
}

export class DoublyLinkedListNode<T = any> implements IDoublyLinkedListNode<T> {
  constructor(
    public value: T,
    public next: IDoublyLinkedListNode<T> | null = null,
    public prev: IDoublyLinkedListNode<T> | null = null,
  ) {
    this.value = value;
    this.next = next;
    this.prev = prev;
  }

  toString(callback?: Callback<T>) {
    return callback ? callback(this.value) : `${this.value}`;
  }
}
