import { Heap } from '../heap';

export class MinHeap<T> extends Heap<T> {
  static of<T>(value: T) {
    const minHeap = new MinHeap<T>();
    minHeap.insert(value);

    return minHeap;
  }

  insert(value: T) {
    this._heap.push(value);

    const lastIndex = this._heap.length - 1;
    this._mapAdd(value, lastIndex);
    this.#heapifyUp(lastIndex);

    return this;
  }

  #heapifyUp(index: number) {
    while (
      this._hasParent(index) &&
      this._compare.lessThan(this._heap[index], this._getParent(index))
    ) {
      const parentIndex = this._getParentIndex(index);
      this._swap(index, parentIndex);

      index = parentIndex;
    }
  }

  poll() {
    if (this.isEmpty) return null;

    const min = this._heap[0];
    const last = this._heap.pop()!;

    if (!this.isEmpty) {
      this._heap[0] = last;
      this.#heapifyDown(0);
    }

    this._mapDelete(min, 0);

    return min;
  }

  #heapifyDown(index: number) {
    while (true) {
      let smallestIndex = index;

      // Check left child
      if (
        this._hasLeftChild(index) &&
        this._compare.lessThan(
          this._getLeftChild(index),
          this._heap[smallestIndex],
        )
      ) {
        smallestIndex = this._getLeftChildIndex(index);
      }

      // Check right child
      if (
        this._hasRightChild(index) &&
        this._compare.lessThan(
          this._getRightChild(index),
          this._heap[smallestIndex],
        )
      ) {
        smallestIndex = this._getRightChildIndex(index);
      }

      if (smallestIndex === index) break;

      this._swap(smallestIndex, index);

      index = smallestIndex;
    }
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
