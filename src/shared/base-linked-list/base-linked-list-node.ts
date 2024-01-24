export type Callback<T> = (value: T) => string;

export class BaseLinkedListNode<T = any> {
  data: T;

  next: BaseLinkedListNode<T> | null;

  constructor(data: T, next: BaseLinkedListNode<T> | null = null) {
    this.data = data;
    this.next = next;
  }

  toString(callback?: Callback<T>): string {
    return callback ? callback(this.data) : `${this.data}`;
  }
}
