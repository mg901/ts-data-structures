import { type Callback } from '@/shared/base-linked-list';

export class BaseLinkedListNode<T = any> {
  constructor(
    public value: T,
    public next: BaseLinkedListNode<T> | null = null,
  ) {}

  toString(callback?: Callback<T>): string {
    return callback ? callback(this.value) : `${this.value}`;
  }
}
