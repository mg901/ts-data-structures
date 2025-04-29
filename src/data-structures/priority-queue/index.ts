import { Nullable } from '@/shared/types';
import { Heap } from '../heap';

export interface IPriorityQueue<T> {
  get size(): number;
  get isEmpty(): boolean;
  enqueue(value: T): this;
  dequeue(): Nullable<T>;
  front(): Nullable<T>;
  back(): Nullable<T>;
  remove(
    predicate: (value: T, index: number, obj: T[]) => unknown,
  ): Nullable<T>;
  has(predicate: (value: T, index: number, obj: T[]) => unknown): boolean;
  clear(): void;
  toArray(): T[];
  toString(): string;
}

export class PriorityQueue<T> implements IPriorityQueue<T> {
  #items: Heap<T>;

  static of<T>(value: T, compareFn?: (a: T, b: T) => number) {
    const pq = new PriorityQueue<T>(compareFn);
    pq.enqueue(value);

    return pq;
  }

  static fromArray<T>(values: T[], compareFn?: (a: T, b: T) => number) {
    return new PriorityQueue(compareFn, values);
  }

  constructor(compareFn?: (a: T, b: T) => number, values: T[] = []) {
    this.#items = new Heap(compareFn, values);

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

  enqueue(value: T) {
    this.#items.insert(value);

    return this;
  }

  dequeue() {
    return this.#items.poll();
  }

  front() {
    return this.#items.peek();
  }

  back() {
    return this.#items.last();
  }

  remove(predicate: (value: T, index: number, obj: T[]) => unknown) {
    return this.#items.remove(predicate);
  }

  has(predicate: (value: T, index: number, obj: T[]) => unknown) {
    return this.#items.has(predicate);
  }

  toArray() {
    return this.#items.toArray();
  }

  clear() {
    return this.#items.clear();
  }

  *[Symbol.iterator]() {
    while (!this.#items.isEmpty) {
      yield this.#items.poll();
    }
  }

  toString() {
    return this.#items.toString();
  }
}
