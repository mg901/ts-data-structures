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
  #heap: Heap<T>;

  static of<T>(value: T, compareFn?: (a: T, b: T) => number) {
    const pq = new PriorityQueue<T>(compareFn);
    pq.enqueue(value);

    return pq;
  }

  static fromArray<T>(values: T[], compareFn?: (a: T, b: T) => number) {
    return new PriorityQueue(compareFn, values);
  }

  constructor(compareFn?: (a: T, b: T) => number, values: T[] = []) {
    this.#heap = new Heap(compareFn, values);

    if (values) {
      this.#heap.heapify();
    }
  }

  get size() {
    return this.#heap.size;
  }

  get isEmpty() {
    return this.#heap.isEmpty;
  }

  enqueue(value: T) {
    this.#heap.insert(value);

    return this;
  }

  dequeue() {
    return this.#heap.poll();
  }

  front() {
    return this.#heap.peek();
  }

  back() {
    return this.#heap.last();
  }

  remove(predicate: (value: T, index: number, obj: T[]) => unknown) {
    return this.#heap.remove(predicate);
  }

  has(predicate: (value: T, index: number, obj: T[]) => unknown) {
    return this.#heap.has(predicate);
  }

  clear() {
    return this.#heap.clear();
  }

  toArray() {
    return this.#heap.toArray();
  }

  toString() {
    return this.#heap.toString();
  }
}
