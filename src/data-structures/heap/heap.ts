/* eslint-disable class-methods-use-this */
import { Comparator, CompareFn } from '@/shared/comparator';
import { Nullable } from '@/shared/types';

export interface IHeap<T> {
  get isEmpty(): boolean;
  get size(): number;
  peek(): Nullable<T>;
  clear(): void;
  toString(): string;
  insert(value: T): this;
  poll(): Nullable<T>;
  delete(value: T): Nullable<T>;
}

export abstract class Heap<T> implements IHeap<T> {
  protected _heap: T[] = [];

  protected _indexMap = new Map<T, Set<number>>();

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

  clear() {
    this._heap = [];
    this._indexMap.clear();
  }

  toString(): string {
    return this._heap.join(',');
  }

  abstract insert(value: T): this;
  abstract poll(): Nullable<T>;
  abstract delete(value: T): Nullable<T>;

  protected _swap(index1: number, index2: number) {
    this._mapSwap(this._heap[index1], this._heap[index2], index1, index2);
    swap(this._heap, index1, index2);
  }

  // parent
  protected _getParentIndex(childIndex: number) {
    return Math.floor((childIndex - 1) / 2);
  }

  protected _getParent(index: number) {
    return this._heap[this._getParentIndex(index)];
  }

  protected _hasParent(index: number) {
    return index > 0;
  }

  // left
  protected _getLeftChildIndex(parentIndex: number) {
    return parentIndex * 2 + 1;
  }

  protected _getLeftChild(index: number) {
    return this._heap[this._getLeftChildIndex(index)];
  }

  protected _hasLeftChild(index: number) {
    return this._getLeftChildIndex(index) < this._heap.length;
  }

  // right
  protected _getRightChildIndex(parentIndex: number) {
    return parentIndex * 2 + 2;
  }

  protected _getRightChild(index: number) {
    return this._heap[this._getRightChildIndex(index)];
  }

  protected _hasRightChild(index: number) {
    return this._getRightChildIndex(index) < this._heap.length;
  }

  // indexMap

  protected _mapAdd(value: T, index: number) {
    if (!this._indexMap.has(value)) {
      this._indexMap.set(value, new Set());
    }

    this._indexMap.get(value)!.add(index);
  }

  protected _mapDelete(value: T, index: number) {
    if (!this._indexMap.has(value)) return;

    const indexes = this._indexMap.get(value)!;
    indexes.delete(index);

    if (!this.size) {
      this._indexMap.delete(value);
    }
  }

  protected _mapReplace(value: T, oldIndex: number, newIndex: number) {
    this._mapDelete(value, oldIndex);
    this._mapAdd(value, newIndex);
  }

  protected _mapSwap(value1: T, value2: T, index1: number, index2: number) {
    this._mapReplace(value1, index1, index2);
    this._mapReplace(value2, index2, index1);
  }

  protected _getIndex(value: T) {
    const indexes = this._indexMap.get(value);

    return indexes?.values().next().value ?? -1;
  }
}

export function swap(arr: unknown[], from: number, to: number) {
  const temp = arr[to];
  arr[to] = arr[from];
  arr[from] = temp;
}
