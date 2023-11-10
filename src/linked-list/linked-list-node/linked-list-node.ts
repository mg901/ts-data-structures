export type Callback<T> = (data: T) => string;

export class LinkedListNode<T = any> {
  data: T;

  next: LinkedListNode<T> | null;

  constructor(data: any, next: LinkedListNode<T> | null = null) {
    this.data = data;
    this.next = next;
  }

  toString(callback: Callback<T>) {
    return callback ? callback(this.data) : `${this.data}`;
  }
}
