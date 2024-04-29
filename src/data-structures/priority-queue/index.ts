import { MinHeap } from '@/data-structures/heap';
import { Nullable } from '@/shared/types';

export interface IPriorityQueue<T> {
  get size(): number;
  get isEmpty(): boolean;
  peek(): Nullable<T>;
  insert(value: T, priority: number): this;
  changePriority(value: T, priority: number): this;
  has(value: T): boolean;
  delete(value: T): Nullable<T>;
  clear(): void;
}

export class PriorityQueue<T = any> implements IPriorityQueue<T> {
  #priorities = new Map<T, number>();

  #comparePriority = (a: T, b: T) => {
    const first = this.#priorities.get(a)!;
    const second = this.#priorities.get(b)!;

    if (first === second) return 0;

    return first < second ? -1 : 1;
  };

  #minHeap = new MinHeap<T>(this.#comparePriority);

  get size() {
    return this.#minHeap.size;
  }

  get isEmpty() {
    return this.#minHeap.isEmpty;
  }

  peek() {
    return this.#minHeap.peek();
  }

  insert(value: T, priority = 0) {
    this.#priorities.set(value, priority);

    this.#minHeap.insert(value);

    return this;
  }

  changePriority(value: T, priority: number) {
    this.delete(value);
    this.insert(value, priority);

    return this;
  }

  has(value: T): boolean {
    return this.#priorities.has(value);
  }

  delete(value: T) {
    this.#priorities.delete(value);

    return this.#minHeap.delete(value);
  }

  toString() {
    return this.#minHeap.toString();
  }

  clear() {
    this.#minHeap.clear();
  }
}
