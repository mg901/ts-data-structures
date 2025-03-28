import { Comparator, CompareFn } from '@/shared/comparator';
import { Nullable } from '@/shared/types';

export interface IHeap<T> {
  get isEmpty(): boolean;
  get size(): number;
  peek(): Nullable<T>;
  has(predicate: (value: T, index: number, obj: T[]) => unknown): boolean;
  clear(): void;
  toString(): string;
  insert(value: T): this;
  poll(): Nullable<T>;
  delete(
    predicate: (value: T, index: number, obj: T[]) => unknown,
  ): Nullable<T>;
}

export abstract class Heap<T> implements IHeap<T> {
  protected _heap: T[] = [];

  protected _compare: Comparator<T>;

  constructor(compareFn?: CompareFn<T>) {
    this._compare = new Comparator(compareFn);
  }

  get isEmpty() {
    return this._heap.length === 0;
  }

  get size() {
    return this._heap.length;
  }

  peek() {
    return this.isEmpty ? null : this._heap[0];
  }

  has(predicate: (value: T, index: number, obj: T[]) => unknown) {
    return this._findIndex(predicate) > -1;
  }

  protected _findIndex(
    predicate: (value: T, index: number, obj: T[]) => unknown,
  ) {
    return this._heap.findIndex(predicate);
  }

  clear() {
    this._heap = [];
  }

  toArray() {
    return Array.from(this._heap);
  }

  toString(): string {
    return this.toArray().toString();
  }

  *[Symbol.iterator]() {
    for (const item of this._heap) {
      yield item;
    }
  }

  abstract insert(value: T): this;
  abstract poll(): Nullable<T>;
  abstract delete(
    predicate: (value: T, index: number, obj: T[]) => unknown,
  ): Nullable<T>;

  protected _swap(index1: number, index2: number) {
    if (index1 === index2) return;

    swap(this._heap, index1, index2);
  }

  // parent
  protected _getParent(index: number) {
    return this._heap[this._calcParentIndex(index)];
  }

  protected _calcParentIndex(childIndex: number) {
    return Math.floor((childIndex - 1) / 2);
  }

  // left
  protected _getLeftChild(index: number) {
    return this._heap[this._calcLeftChildIndex(index)];
  }

  protected _hasLeftChild(index: number) {
    return this._calcLeftChildIndex(index) < this.size;
  }

  protected _calcLeftChildIndex(parentIndex: number) {
    return parentIndex * 2 + 1;
  }

  // right
  protected _getRightChild(index: number) {
    return this._heap[this._calcRightChildIndex(index)];
  }

  protected _hasRightChild(index: number) {
    return this._calcRightChildIndex(index) < this.size;
  }

  protected _calcRightChildIndex(parentIndex: number) {
    return parentIndex * 2 + 2;
  }
}

export function swap(arr: unknown[], from: number, to: number) {
  const temp = arr[to];
  arr[to] = arr[from];
  arr[from] = temp;
}
