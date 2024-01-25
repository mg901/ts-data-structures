import { BaseLinkedListNode, type Callback } from './base-linked-list-node';
import { Comparator, CompareFunction } from '../comparator';

export type Predicate<T = unknown> = (value: T) => boolean;

export abstract class BaseLinkedList<
  T = any,
  Node extends BaseLinkedListNode<T> = BaseLinkedListNode<T>,
> {
  protected _head: Node | null = null;

  protected _tail: Node | null = null;

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

  fromArray(array: T[]) {
    array.forEach((value) => {
      this.append(value);
    });

    return this;
  }

  toArray() {
    return Array.from(this, (node) => node.data);
  }

  find(value: T): Node | null;
  find(predicate: Predicate<T>): Node | null;
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
    let currentNode = this._head;

    while (currentNode !== null) {
      if (this._compare.equal(value, currentNode.data)) {
        return count;
      }

      currentNode = currentNode.next as Node;
      count += 1;
    }

    return -1;
  }

  clear() {
    this._head = null;
    this._tail = null;
    this._size = 0;
  }

  toString(callback?: Callback<T>) {
    return Array.from(this, (node) => node.toString(callback)).toString();
  }

  // Common methods
  abstract append(value: T): this;
  abstract prepend(value: T): this;
  abstract delete(value: T | Predicate<T>): Node | null;
  abstract insertAt(index: number, value: T): this;
  abstract reverse(): this;
  abstract deleteHead(): Node | null;
  abstract deleteTail(): Node | null;
}

function isFunction(a: unknown): a is Predicate {
  return typeof a === 'function';
}
