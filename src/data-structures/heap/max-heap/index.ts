import { Heap } from '../index';

export class MaxHeap<T = any> extends Heap<T> {
  static of<T>(value: T) {
    const heap = new MaxHeap<T>().insert(value);

    return heap;
  }

  insert(value: T) {
    this._heap.push(value);
    this.#heapifyUp();

    return this;
  }

  #heapifyUp(startIndex: number = this.size - 1): void {
    let currentIndex = startIndex;

    while (currentIndex > 0) {
      const parentIndex = this._getParentIndex(currentIndex);
      const parent = this._heap[parentIndex];
      const current = this._heap[currentIndex];

      if (parent >= current) break;
      this._swapByIndex(currentIndex, parentIndex);
      currentIndex = parentIndex;
    }
  }

  poll() {
    if (this._heap.length === 0) return null;
    if (this._heap.length === 1) {
      return this._heap.pop()!;
    }

    const maxItem = this._heap[0]!;
    this._heap[0] = this._heap.pop()!;
    this.#heapifyDown();

    return maxItem;
  }

  #heapifyDown(startIndex: number = 0) {
    let currentIndex = startIndex;

    while (true) {
      const leftChildIndex = this._getLeftChildIndex(currentIndex);
      const rightChildIndex = this._getRightChildIndex(currentIndex);
      let maxIndex = currentIndex;

      if (
        leftChildIndex < this._heap.length &&
        this._heap[leftChildIndex] > this._heap[maxIndex]
      ) {
        maxIndex = leftChildIndex;
      }

      if (
        rightChildIndex < this._heap.length &&
        this._heap[rightChildIndex] > this._heap[maxIndex]
      ) {
        maxIndex = rightChildIndex;
      }

      if (maxIndex === currentIndex) break;

      this._swapByIndex(currentIndex, maxIndex);
      currentIndex = maxIndex;
    }
  }

  delete(value: T) {
    const indexToRemove = this._heap.findIndex((item) => item === value);

    if (indexToRemove === -1) return null;

    // Replace the element to remove with the last element in the heap.
    this._heap[indexToRemove] = this._heap.pop()!;

    // If the element was the last element, no need to heapify.
    if (indexToRemove === this.size) return value;

    // Heapify up and down to maintain the heap property.
    const ItemToRemove = this._getCurrent(indexToRemove);
    const parentItem = this._getParent(indexToRemove)!;
    if (parentItem !== null && ItemToRemove < parentItem) {
      this.#heapifyUp(indexToRemove);
    } else {
      this.#heapifyDown(indexToRemove);
    }

    return value;
  }
}
