import { Comparator, CompareFn } from '@/shared/comparator';
import { Nullable } from '@/shared/types';

export interface IHeap<T> {
  get isEmpty(): boolean;
  get size(): number;
  peek(): Nullable<T>;
  has(value: T): boolean;
  clear(): void;
  toString(): string;
  insert(value: T): this;
  poll(): Nullable<T>;
  delete(value: T): Nullable<T>;
}

export abstract class Heap<T> implements IHeap<T> {
  protected _heap: T[] = [];

  protected _compare: Comparator<T>;

  // parent
  protected static _hasParent(index: number) {
    return index > 0;
  }

  protected static _getParentIndex(childIndex: number) {
    return Math.floor((childIndex - 1) / 2);
  }

  // left
  protected static _getLeftChildIndex(parentIndex: number) {
    return parentIndex * 2 + 1;
  }

  // right
  protected static _getRightChildIndex(parentIndex: number) {
    return parentIndex * 2 + 2;
  }

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

  has(value: T) {
    return this._getIndex(value) > -1;
  }

  protected _getIndex(value: T) {
    return this._heap.findIndex((item) => item === value);
  }

  clear() {
    this._heap = [];
  }

  toArray() {
    return this._heap;
  }

  toString(): string {
    return this.toArray().toString();
  }

  abstract insert(value: T): this;
  abstract poll(): Nullable<T>;
  abstract delete(value: T): Nullable<T>;

  protected _swap(index1: number, index2: number) {
    if (index1 === index2) return;

    swap(this._heap, index1, index2);
  }

  // parent
  protected _getParent(index: number) {
    return this._heap[Heap._getParentIndex(index)];
  }

  // left
  protected _getLeftChild(index: number) {
    return this._heap[Heap._getLeftChildIndex(index)];
  }

  protected _hasLeftChild(index: number) {
    return Heap._getLeftChildIndex(index) < this.size;
  }

  // right
  protected _getRightChild(index: number) {
    return this._heap[Heap._getRightChildIndex(index)];
  }

  protected _hasRightChild(index: number) {
    return Heap._getRightChildIndex(index) < this.size;
  }
}

export function swap(arr: unknown[], from: number, to: number) {
  const temp = arr[to];
  arr[to] = arr[from];
  arr[from] = temp;
}
