import { Nullable } from '@/shared/types';

type Compare<T> = (a: T, b: T) => number;

type Predicate<T> = (value: T, index: number, obj: T[]) => unknown;

export interface IHeap<T> {
  get isEmpty(): boolean;
  get size(): number;
  peek(): Nullable<T>;
  insert(value: T): this;
  poll(): Nullable<T>;
  heapify(): void;
  last(): Nullable<T>;
  remove(
    predicate: (value: T, index: number, obj: T[]) => unknown,
  ): Nullable<T>;
  has(predicate: (value: T, index: number, obj: T[]) => unknown): boolean;
  clear(): void;
  toArray(): T[];
  toString(): string;
}

const defaultCompareFn = <T>(a: T, b: T): number => (a < b ? -1 : 1);

export class Heap<T> implements IHeap<T> {
  #items: T[];

  #compare: Compare<T>;

  constructor(compareFn = defaultCompareFn<T>, values: T[] = []) {
    this.#items = values;
    this.#compare = compareFn;
  }

  get size() {
    return this.#items.length;
  }

  get isEmpty() {
    return this.#items.length === 0;
  }

  insert(value: T) {
    this.#items.push(value);
    this.#heapifyUp();

    return this;
  }

  peek() {
    return this.#items[0] ?? null;
  }

  last() {
    return this.#items.at(-1) ?? null;
  }

  #heapifyUp(index: number = this.size - 1) {
    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2);
      if (this.#isPrior(parentIndex, index)) break;

      this.#swap(index, parentIndex);

      index = parentIndex;
    }
  }

  #isPrior(i: number, j: number) {
    return this.#compare(this.#items[i], this.#items[j]) < 0;
  }

  #swap(i: number, j: number) {
    if (i === j) return;

    const temp = this.#items[j];
    this.#items[j] = this.#items[i];
    this.#items[i] = temp;
  }

  poll() {
    if (this.size === 0) return null;
    if (this.size === 1) return this.#items.pop()!;

    const min = this.#items[0];
    this.#items[0] = this.#items.pop()!;
    this.#heapifyDown();

    return min;
  }

  #heapifyDown(index: number = 0) {
    while (true) {
      let currentIdx = index;
      const leftChildIdx = index * 2 + 1;
      const rightChildIdx = index * 2 + 2;

      // Check left child
      if (
        this.#hasParent(leftChildIdx) &&
        this.#isPrior(leftChildIdx, currentIdx)
      ) {
        currentIdx = leftChildIdx;
      }

      // Check right child
      if (
        this.#hasParent(rightChildIdx) &&
        this.#isPrior(rightChildIdx, currentIdx)
      ) {
        currentIdx = rightChildIdx;
      }

      if (currentIdx === index) break;

      this.#swap(currentIdx, index);

      index = currentIdx;
    }
  }

  heapify() {
    for (let i = Math.floor(this.size / 2) - 1; i >= 0; i -= 1) {
      this.#heapifyDown(i);
    }
  }

  #hasParent(index: number) {
    return index < this.size;
  }

  remove(predicate: Predicate<T>) {
    const index = this.#findIndex(predicate);

    if (index === -1) return null;

    const lastIndex = this.size - 1;

    if (index === lastIndex) {
      return this.#items.pop()!;
    }

    this.#swap(index, lastIndex);
    const value = this.#items.pop()!;

    if (index > 0) {
      this.#heapifyUp(index);
    } else {
      this.#heapifyDown();
    }

    return value;
  }

  has(predicate: Predicate<T>) {
    return this.#findIndex(predicate) > -1;
  }

  #findIndex(predicate: Predicate<T>) {
    return this.#items.findIndex(predicate);
  }

  clear() {
    this.#items = [];
  }

  toArray() {
    return this.#items;
  }

  toString() {
    return this.toArray().toString();
  }

  // eslint-disable-next-line class-methods-use-this
  get [Symbol.toStringTag]() {
    return `${this.constructor.name}`;
  }
}
