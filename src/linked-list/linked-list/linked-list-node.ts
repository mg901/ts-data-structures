export type Callback<T> = (data: T) => string;

export class LinkedListNode<T = any> {
  value: T;

  next: LinkedListNode<T> | null;

  constructor(data: any, next: LinkedListNode<T> | null = null) {
    this.value = data;
    this.next = next;
  }

  toString(callback?: Callback<T>) {
    return callback ? callback(this.value) : `${this.value}`;
  }
}
