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

export class Heap<T> implements IHeap<T> {
  #nodes: T[];

  #compare: Compare<T>;

  constructor(
    compareFn = (a: T, b: T): number => {
      if (a === b) return 0;

      return a < b ? 1 : -1;
    },
    values: T[] = [],
  ) {
    this.#nodes = values;
    this.#compare = compareFn;
  }

  get size() {
    return this.#nodes.length;
  }

  get isEmpty() {
    return this.#nodes.length === 0;
  }

  insert(value: T) {
    this.#nodes.push(value);
    this.#heapifyUp();

    return this;
  }

  peek() {
    return this.#nodes[0] ?? null;
  }

  last() {
    return this.#nodes.at(-1) ?? null;
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
    return this.#compare(this.#nodes[i], this.#nodes[j]) > 0;
  }

  #swap(i: number, j: number) {
    if (i === j) return;

    const temp = this.#nodes[j];
    this.#nodes[j] = this.#nodes[i];
    this.#nodes[i] = temp;
  }

  poll() {
    const { length } = this.#nodes;

    if (length === 0) return null;
    if (length === 1) return this.#nodes.pop() ?? null;

    const min = this.#nodes[0];
    this.#nodes[0] = this.#nodes.pop()!;
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

    if (index === this.size - 1) {
      return this.#nodes.pop()!;
    }

    this.#swap(index, this.size - 1);
    const value = this.#nodes.pop()!;

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
    return this.#nodes.findIndex(predicate);
  }

  clear() {
    this.#nodes = [];
  }

  toArray() {
    return this.#nodes;
  }

  toString() {
    return this.toArray().toString();
  }
}
