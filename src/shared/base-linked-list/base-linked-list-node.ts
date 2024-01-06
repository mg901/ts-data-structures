export type Callback<T> = (value: T) => string;

export class BaseLinkedListNode<T = any> {
  constructor(
    public value: T,
    public next: BaseLinkedListNode<T> | null = null,
  ) {}

  toString(callback?: Callback<T>): string {
    return callback ? callback(this.value) : `${this.value}`;
  }
}
