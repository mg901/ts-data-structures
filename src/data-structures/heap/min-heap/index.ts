import isFunction from 'lodash.isfunction';
import { Heap } from '../heap';

export class MinHeap<T> {
  #items: Heap<T>;

  static of<T>(value: T, selector?: (item: T) => T) {
    const minHeap = new MinHeap<T>(selector);

    return minHeap.insert(value);
  }

  static fromArray<T>(values: T[], selector?: (item: T) => T) {
    return new MinHeap(selector, values);
  }

  constructor(selector?: (item: T) => T, values: T[] = []) {
    this.#items = new Heap((a: T, b: T): number => {
      const first = isFunction(selector) ? selector(a) : a;
      const second = isFunction(selector) ? selector(b) : b;

      return first < second ? -1 : 1;
    }, values);

    if (values) {
      this.#items.heapify();
    }
  }

  get size() {
    return this.#items.size;
  }

  get isEmpty() {
    return this.#items.isEmpty;
  }

  insert(value: T) {
    this.#items.insert(value);

    return this;
  }

  peek() {
    return this.#items.peek();
  }

  poll() {
    return this.#items.poll();
  }

  remove(predicate: (value: T, index: number, obj: T[]) => unknown) {
    return this.#items.remove(predicate);
  }

  has(predicate: (value: T, index: number, obj: T[]) => unknown) {
    return this.#items.has(predicate);
  }

  clear() {
    return this.#items.clear();
  }

  toArray() {
    return this.#items.toArray();
  }

  *[Symbol.iterator]() {
    while (!this.#items.isEmpty) {
      yield this.#items.poll();
    }
  }

  toString() {
    return this.#items.toString();
  }

  // eslint-disable-next-line class-methods-use-this
  get [Symbol.toStringTag]() {
    return `${this.constructor.name}`;
  }
}
