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

  // Up from the bottom
  #heapifyUp(startIndex: number = this.size - 1): void {
    let currentIndex = startIndex;

    while (currentIndex > 0) {
      const parentIndex = this._getParentIndex(currentIndex);
      const parent = this._getElementValue(parentIndex);
      const current = this._getElementValue(currentIndex);

      if (parent >= current) {
        break;
      }

      this._swapByIndex(currentIndex, parentIndex);
      currentIndex = parentIndex;
    }
  }

  poll() {
    if (this._heap.length === 0) return null;
    if (this._heap.length === 1) {
      const maxItem = this._heap.pop()!;

      return maxItem;
    }

    const maxElementIndex = 0;
    const maxElement = this._getElementValue(maxElementIndex);
    this._heap[maxElementIndex] = this._heap.pop()!;

    this.#heapifyDown();

    return maxElement;
  }

  // Let's go down
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
    const indexToDelete = this._heap.findIndex((item) => item === value);

    if (indexToDelete === -1) return null;

    const deletedValue = this._getElementValue(indexToDelete);
    const lastElement = this._heap.pop()!;

    // If the deleted element is the last element, no need to heapify
    if (indexToDelete === this.size) return deletedValue;

    // Replace the deleted element with the last element
    this._heap[indexToDelete] = lastElement;

    // Heapify up and down to maintain the heap property
    const parentElement = this._getParent(indexToDelete);
    if (parentElement !== null && lastElement < parentElement) {
      this.#heapifyUp(indexToDelete);
    } else {
      // Heapify down after deleting the max element from the top.
      this.#heapifyDown(indexToDelete);
    }

    return deletedValue;
  }
}
