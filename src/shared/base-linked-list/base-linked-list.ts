import { BaseLinkedListNode, type Callback } from './base-linked-list-node';
import { Comparator, CompareFunction } from '../comparator';

export type Matcher<T> = T | ((value: T) => boolean);

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

  protected _isMatch(value: T, matcher: Matcher<T>) {
    return typeof matcher === 'function'
      ? // @ts-ignore
        matcher(value)
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
    let values = [];

    for (const node of this) {
      values.push(node.value);
    }

    return values;
  }

  indexOf(value: T): number {
    let count = 0;
    let currentNode = this._head;

    while (currentNode !== null) {
      if (this._compare.equal(value, currentNode.value)) return count;

      currentNode = currentNode.next as Node;
      count += 1;
    }

    return -1;
  }

  clear(): void {
    this._head = null;
    this._tail = null;
    this._size = 0;
  }

  toString(callback?: Callback<T>) {
    let nodes = [];

    for (const node of this) {
      nodes.push(node);
    }

    return nodes
      .map((node: Node) => node.toString(callback as Callback<T>))
      .toString();
  }

  // Common methods
  abstract append(value: T): this;
  abstract prepend(value: T): this;
  abstract delete(matcher: Matcher<T>): Node | null;
  abstract find(options: Matcher<T>): Node | null;
  abstract insertAt(index: number, value: T): this;
  abstract reverse(): this;
  abstract deleteHead(): Node | null;
  abstract deleteTail(): Node | null;
}
