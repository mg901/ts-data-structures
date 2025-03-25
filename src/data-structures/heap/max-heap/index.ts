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

    const lastIndex = this.size - 1;
    this._mapAdd(value, lastIndex);
    this.#heapifyUp(lastIndex);

    return this;
  }

  #heapifyUp(index: number) {
    while (
      this._hasParent(index) &&
      this._compare.greaterThan(this._heap[index], this._getParent(index))
    ) {
      const parentIndex = this._getParentIndex(index);
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
        largestIndex = this._getLeftChildIndex(index);
      }

      // Check right child
      if (
        this._hasRightChild(index) &&
        this._compare.greaterThan(
          this._getRightChild(index),
          this._heap[largestIndex],
        )
      ) {
        largestIndex = this._getRightChildIndex(index);
      }

      if (largestIndex === index) break;

      this._swap(largestIndex, index);

      index = largestIndex;
    }
  }

  poll() {
    if (this.isEmpty) return null;

    const max = this._heap[0];
    const last = this._heap.pop()!;

    if (!this.isEmpty) {
      this._heap[0] = last;
      this.#heapifyDown(0);
    }

    this._mapDelete(max, 0);

    return max;
  }

  delete(value: T) {
    if (!this._indexMap.has(value)) return null;

    const index = this._getIndex(value);

    this._swap(index, this.size - 1);
    const deleted = this._heap.pop()!;
    this._mapDelete(value, index);

    if (
      this._hasParent(index) &&
      this._compare.lessThan(this._heap[index], this._getParent(index))
    ) {
      this.#heapifyUp(index);
    } else {
      this.#heapifyDown(index);
    }

    return deleted;
  }
}
