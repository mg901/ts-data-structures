import { Comparator, CompareFunction } from '@/shared/comparator';
import { type Callback } from '@/shared/node';
import { Nullable } from '@/shared/types';
import isFunction from 'lodash.isfunction';
import { SinglyLinkedListNode } from './singly-linked-list/node';

export type Predicate<T = unknown> = (value: T) => boolean;

export abstract class LinkedList<
  T = any,
  Node extends SinglyLinkedListNode<T> = SinglyLinkedListNode<T>,
> {
  protected _head: Nullable<Node> = null;

  protected _tail: Nullable<Node> = null;

  protected _size: number = 0;

  protected _compare: Comparator<T>;

  constructor(compareFunction?: CompareFunction<T>) {
    this._compare = new Comparator(compareFunction);
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
    return this._head === null;
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

  *[Symbol.iterator]() {
    let currentNode = this._head;

    while (currentNode !== null) {
      yield currentNode;
      currentNode = currentNode.next as Node;
    }
  }

  toString(callback?: Callback<T>) {
    const array = Array.from(this, (node) => node.toString(callback));

    return array.toString();
  }

  toArray() {
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

  indexOf(value: T) {
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
  abstract deleteByValue(value: T | Predicate<T>): Nullable<Node>;
  abstract insertAt(index: number, value: T): this;
  abstract reverse(): this;
  abstract deleteHead(): Nullable<Node>;
  abstract deleteTail(): Nullable<Node>;
}
