import { Heap } from '../heap';

export class MinHeap<T = any> extends Heap<T> {
  static of<T>(value: T) {
    const minHeap = new MinHeap();
    minHeap.insert(value);

    return minHeap;
  }

  insert(value: T): this {
    this._heap.push(value);
    this.#heapifyUp();

    return this;
  }

  #heapifyUp(startIndex: number = this.size - 1) {
    let currentIndex = startIndex;

    while (currentIndex > 0) {
      const parentIndex = this._getParentIndex(currentIndex);
      const parentElement = this._heap[parentIndex];
      const currentElement = this._heap[currentIndex];

      if (parentElement <= currentElement) break;

      this._swapByIndex(parentIndex, currentIndex);
      currentIndex = parentIndex;
    }
  }

  poll() {
    if (this._heap.length === 0) return null;
    if (this._heap.length === 1) {
      return this._heap.pop()!;
    }

    const minElementIndex = 0;
    const minElement = this._heap[minElementIndex];
    this._heap[minElementIndex] = this._heap.pop()!;

    this.#heapifyDown();

    return minElement;
  }

  #heapifyDown(startIndex: number = 0) {
    let currentIndex = startIndex;

    // eslint-disable-next-line no-constant-condition
    while (true) {
      const leftChildIndex = this._getLeftChildIndex(currentIndex);
      const rightChildIndex = this._getRightChildIndex(currentIndex);
      let minIndex = currentIndex;

      if (
        leftChildIndex < this._heap.length &&
        this._heap[leftChildIndex] < this._heap[minIndex]
      ) {
        minIndex = leftChildIndex;
      }

      if (
        rightChildIndex < this._heap.length &&
        this._heap[rightChildIndex] < this._heap[minIndex]
      ) {
        minIndex = rightChildIndex;
      }

      if (minIndex === currentIndex) break;

      this._swapByIndex(currentIndex, minIndex);
      currentIndex = minIndex;
    }
  }

  delete(value: T) {
    const indexToDelete = this._heap.findIndex((item) => item === value);

    if (indexToDelete === -1) return null;

    const deletedValue = this._heap[indexToDelete];
    const lastElement = this._heap.pop()!;

    // If the deleted element is the last element, no need to heapify
    if (indexToDelete === this.size) return deletedValue;

    // Replace the deleted element with the last element
    this._heap[indexToDelete] = lastElement;

    // Heapify up and down to maintain the heap property
    const parentElement = this._getParent(indexToDelete);
    if (parentElement !== null && lastElement > parentElement) {
      this.#heapifyUp(indexToDelete);
    } else {
      // Heapify down after deleting the max element from the top.
      this.#heapifyDown(indexToDelete);
    }

    return deletedValue;
  }
}
