import { BaseLinkedListNode, type Callback } from './base-linked-list-node';
import { Comparator, CompareFunction } from '../comparator';

export type Matcher<T> = T | ((value: T) => boolean);

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

  protected $isMatch(value: T, matcher: Matcher<T>) {
    return typeof matcher === 'function'
      ? // @ts-ignore
        matcher(value)
      : this.$compare.equal(matcher, value);
  }

  protected $findNodeByIndex(index: number) {
    let currentNode = this.$head!;

    for (let i = 0; i < index; i += 1) {
      currentNode = currentNode.next as Node;
    }

    return currentNode;
  }

  *[Symbol.iterator]() {
    let currentNode = this.$head;

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
    let currentNode = this.$head;

    while (currentNode !== null) {
      if (this.$compare.equal(value, currentNode.value)) return count;

      currentNode = currentNode.next as Node;
      count += 1;
    }

    return -1;
  }

  clear(): void {
    this.$head = null;
    this.$tail = null;
    this.$size = 0;
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
