import { Heap } from '../heap';

export class MaxHeap<T> extends Heap<T> {
  static of<T>(value: T) {
    const maxHeap = new MaxHeap<T>();
    maxHeap.insert(value);

    return maxHeap;
  }

  static fromArray<T>(array: T[]) {
    const maxHeap = new MaxHeap<T>();

    maxHeap._heap = Array.from(array);
    maxHeap.#buildHeap();

    return maxHeap;
  }

  #buildHeap() {
    for (let i = Math.floor(this.size / 2) - 1; i >= 0; i -= 1) {
      this.#heapifyDown(i);
    }
  }

  insert(value: T) {
    this._heap.push(value);
    this.#heapifyUp(this.size - 1);

    return this;
  }

  #heapifyUp(index: number) {
    while (
      Heap._hasParent(index) &&
      this._compare.greaterThan(this._heap[index], this._getParent(index))
    ) {
      const parentIndex = Heap._getParentIndex(index);
      this._swap(index, parentIndex);

      index = parentIndex;
    }
  }

  #heapifyDown(index: number) {
    while (true) {
      let largestIndex = index;

      // Check left child
      if (
        this._hasLeftChild(index) &&
        this._compare.greaterThan(
          this._getLeftChild(index),
          this._heap[largestIndex],
        )
      ) {
        largestIndex = Heap._getLeftChildIndex(index);
      }

      // Check right child
      if (
        this._hasRightChild(index) &&
        this._compare.greaterThan(
          this._getRightChild(index),
          this._heap[largestIndex],
        )
      ) {
        largestIndex = Heap._getRightChildIndex(index);
      }

      if (largestIndex === index) break;

      this._swap(largestIndex, index);

      index = largestIndex;
    }
  }

  poll() {
    if (this.isEmpty) return null;

    const max = this._heap[0];
    const lastIndex = this.size - 1;

    if (lastIndex > 0) {
      this._swap(0, lastIndex);
    }

    this._heap.pop()!;

    if (this.size > 1) {
      this.#heapifyDown(0);
    }

    return max;
  }

  delete(value: T) {
    const index = this._getIndex(value);

    if (index === -1) return null;

    const lastIndex = this.size - 1;

    this._swap(index, lastIndex);
    const deleted = this._heap.pop()!;

    if (index !== lastIndex) {
      if (
        Heap._hasParent(index) &&
        this._compare.lessThan(this._heap[index], this._getParent(index))
      ) {
        this.#heapifyUp(index);
      } else {
        this.#heapifyDown(index);
      }
    }

    return deleted;
  }
}
