/* eslint-disable class-methods-use-this */
import { Nullable } from '@/shared/types';

export interface IHeap<T> {
  get isEmpty(): boolean;
  get size(): number;
  insert(value: T): this;
  peek(): Nullable<T>;
  poll(): Nullable<T>;
  delete(value: T): Nullable<T>;
  clear(): void;
  toString(): string;
}

export abstract class Heap<T = any> implements IHeap<T> {
  protected _heap: T[] = [];

  constructor() {
    if (new.target === Heap) {
      throw new Error(
        'Cannot construct Heap instance directly. Please use MaxHeap or MinHeap instead.',
      );
    }
  }

  get isEmpty() {
    return this._heap.length === 0;
  }

  get size() {
    return this._heap.length;
  }

  abstract insert(value: T): this;
  abstract poll(): Nullable<T>;
  abstract delete(value: T): Nullable<T>;

  peek() {
    if (this.isEmpty) return null;

    return this._heap[0];
  }

  clear() {
    this._heap = [];
  }

  toString(): string {
    return this._heap.join(',');
  }

  protected _getParentIndex(childIndex: number) {
    return Math.floor((childIndex - 1) / 2);
  }

  protected _getLeftChildIndex(parentIndex: number) {
    return parentIndex * 2 + 1;
  }

  protected _getRightChildIndex(parentIndex: number) {
    return parentIndex * 2 + 2;
  }

  protected _hasParent(childIndex: number) {
    return this._getParentIndex(childIndex) >= 0;
  }

  protected _hasLeftChild(parentIndex: number) {
    return this._getLeftChildIndex(parentIndex) < this._heap.length;
  }

  protected _hasRightChild(parentIndex: number) {
    return this._getRightChildIndex(parentIndex) < this._heap.length;
  }

  protected _getParent(childIndex: number) {
    return this._heap[this._getParentIndex(childIndex)] || null;
  }

  protected _getLeftChild(parentIndex: number) {
    return this._heap[this._getLeftChildIndex(parentIndex)] || null;
  }

  protected _getRightChild(parentIndex: number) {
    return this._heap[this._getRightChildIndex(parentIndex)] || null;
  }

  protected _getElement(index: number) {
    return this._heap[index] as T;
  }

  protected _swapByIndex(index1: number, index2: number) {
    [this._heap[index2], this._heap[index1]] = [
      this._heap[index1],
      this._heap[index2],
    ];
  }
}
