import { Comparator, CompareFn } from '@/shared/comparator';
import { type Callback } from '@/shared/node';
import { Nullable } from '@/shared/types';
import { LinkedListNode } from './node';

export { LinkedListNode };

export type Predicate<T = unknown> = (value: T) => boolean;

export interface ILinkedList<
  T = any,
  Node extends LinkedListNode<T> = LinkedListNode<T>,
> {
  get head(): Nullable<Node>;
  get tail(): Nullable<Node>;
  get size(): number;
  get isEmpty(): boolean;

  append(value: T): void;
  fromArray(array: T[]): this;
  toArray(): T[];
  prepend(value: T): this;
  insertAt(index: number, value: T): this;
  indexOf(value: T): number;
  find(value: T | Predicate<T>): Nullable<Node>;
  deleteByValue(value: T | Predicate<T>): Nullable<Node>;
  deleteHead(): Nullable<Node>;
  deleteTail(): Nullable<Node>;
  reverse(): this;
  toString(callback?: Callback<T>): string;
  clear(): void;
}

export abstract class LinkedList<
  T = any,
  Node extends LinkedListNode<T> = LinkedListNode<T>,
> implements ILinkedList<T>
{
  protected _head: Nullable<Node> = null;

  protected _tail: Nullable<Node> = null;

  protected _size = 0;

  protected _compare: Comparator<T>;

  constructor(compareFn?: CompareFn<T>) {
    this._compare = new Comparator(compareFn);
  }

  get head() {
    return this._head;
  }

  get tail() {
    return this._tail;
  }

  get size() {
    return this._size;
  }

  get isEmpty() {
    return this._head === null && this._tail === null && this.size === 0;
  }

  *[Symbol.iterator]() {
    let currentNode = this._head;

    while (currentNode !== null) {
      yield currentNode;

      currentNode = currentNode.next as Node;
    }
  }

  protected _increaseSize() {
    this._size += 1;
  }

  protected _decreaseSize() {
    this._size -= 1;
  }

  protected _initializeList(node: Node) {
    this._head = node;
    this._tail = node;
    this._size = 1;
  }

  protected _isMatch(value: T, matcher: T | Predicate<T>) {
    return isFunction(matcher)
      ? matcher(value)
      : this._compare.equal(matcher, value);
  }

  protected _findNodeByIndex(index: number) {
    let currentNode = this._head!;

    for (let i = 0; i < index; i += 1) {
      currentNode = currentNode.next as Node;
    }

    return currentNode;
  }

  protected _throwIsInvalidIndex(index: number) {
    if (index < 0 || index > this._size) {
      throw new RangeError(
        'Index should be greater than or equal to 0 and less than or equal to the list length.',
      );
    }
  }

  toString(callback?: Callback<T>): string {
    return Array.from(this, (node) => node.toString(callback)).toString();
  }

  toArray(): T[] {
    return Array.from(this, (node) => node.data);
  }

  find(value: T): Nullable<Node>;
  find(predicate: Predicate<T>): Nullable<Node>;
  find(arg: T | Predicate<T>) {
    if (this._head === null) return null;

    for (const node of this) {
      if (this._isMatch(node.data, arg)) {
        return node;
      }
    }

    return null;
  }

  indexOf(value: T): number {
    let count = 0;

    for (const node of this) {
      if (this._compare.equal(value, node.data)) {
        return count;
      }

      count += 1;
    }

    return -1;
  }

  clear() {
    this._head = null;
    this._tail = null;
    this._size = 0;
  }

  // Common methods
  abstract append(value: T): this;
  abstract fromArray(array: T[]): this;
  abstract prepend(value: T): this;
  abstract insertAt(index: number, value: T): this;
  abstract deleteByValue(value: T | Predicate<T>): Nullable<Node>;
  abstract deleteHead(): Nullable<Node>;
  abstract deleteTail(): Nullable<Node>;
  abstract reverse(): this;
}

function isFunction(it: unknown) {
  return typeof it === 'function';
}
