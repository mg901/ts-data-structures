import { Heap } from '../heap';

const compare = <T>(a: T, b: T): number => {
  if (a === b) return 0;

  return a > b ? -1 : 1;
};

export class MaxHeap<T> {
  #heap: Heap<T>;

  static of<T>(value: T) {
    const maxHeap = new MaxHeap<T>();

    return maxHeap.insert(value);
  }

  static fromArray<T>(values: T[], compareFn: (a: T, b: T) => number) {
    return new MaxHeap(compareFn, values);
  }

  constructor(compareFn: (a: T, b: T) => number = compare, values: T[] = []) {
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

  insert(value: T) {
    this.#heap.insert(value);

    return this;
  }

  peek() {
    return this.#heap.peek();
  }

  poll() {
    return this.#heap.poll();
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
