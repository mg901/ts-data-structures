import { BaseLinkedListNode } from './base-linked-list-node';
import { Comparator, CompareFunction } from '../comparator';

export type Callback<T> = (data: T) => string;

type SearchOptions<T> = T | { predicate?: (value: T) => boolean };

export abstract class BaseLinkedList<
  T = any,
  Node extends BaseLinkedListNode<T> = BaseLinkedListNode<T>,
> {
  protected $head: Node | null = null;

  protected $tail: Node | null = null;

  protected $size: number = 0;

  protected $compare: Comparator<T>;

  constructor(compareFunction?: CompareFunction<T>) {
    this.$compare = new Comparator(compareFunction);
  }

  get head() {
    return this.$head;
  }

  get tail() {
    return this.$tail;
  }

  get size() {
    return this.$size;
  }

  get isEmpty() {
    return this.$head === null;
  }

  protected $isMatch(nodeValue: T, options: SearchOptions<T>) {
    return typeof options === 'object' &&
      options !== null &&
      'predicate' in options &&
      options.predicate
      ? options.predicate(nodeValue)
      : this.$compare.equal(options as T, nodeValue);
  }

  // Common methods
  abstract append(value: T): this;
  abstract prepend(value: T): this;
  abstract delete(options: SearchOptions<T>): Node | null;
  abstract find(options: SearchOptions<T>): Node | null;
  abstract insertAt(index: number, value: T): this;
  abstract reverse(): this;
  abstract indexOf(value: T): number;
  abstract deleteHead(): Node | null;
  abstract deleteTail(): Node | null;
  abstract fromArray(array: T[]): this;
  abstract toArray(): T[];
  abstract clear(): void;
  abstract toString(callback: Callback<T>): string;
  abstract [Symbol.iterator](): Iterator<Node>;
}
