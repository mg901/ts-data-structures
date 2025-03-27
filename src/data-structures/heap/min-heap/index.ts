import { Heap } from '../heap';

export class MinHeap<T> extends Heap<T> {
  static of<T>(value: T) {
    const minHeap = new MinHeap<T>();
    minHeap.insert(value);

    return minHeap;
  }

  static fromArray<T>(
    array: T[],
    compareFn?: ConstructorParameters<typeof MinHeap<T>>[0],
  ) {
    const minHeap = new MinHeap<T>(compareFn);

    minHeap._heap = Array.from(array);
    minHeap.#heapify();

    return minHeap;
  }

  #heapify() {
    if (this.size === 1) return;

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
      this._compare.lessThan(this._heap[index], this._getParent(index))
    ) {
      const parentIndex = Heap._getParentIndex(index);
      this._swap(index, parentIndex);

      index = parentIndex;
    }
  }

  #heapifyDown(index: number) {
    // eslint-disable-next-line no-constant-condition
    while (true) {
      let smallestIndex = index;
      const leftChildIndex = Heap._getLeftChildIndex(index);
      const rightChildIndex = Heap._getRightChildIndex(index);

      // Check left child
      if (
        this._hasLeftChild(index) &&
        this._compare.lessThan(
          this._getLeftChild(index),
          this._heap[smallestIndex],
        )
      ) {
        smallestIndex = leftChildIndex;
      }

      // Check right child
      if (
        this._hasRightChild(index) &&
        this._compare.lessThan(
          this._getRightChild(index),
          this._heap[smallestIndex],
        )
      ) {
        smallestIndex = rightChildIndex;
      }

      if (smallestIndex === index) break;

      this._swap(smallestIndex, index);

      index = smallestIndex;
    }
  }

  poll() {
    if (this.isEmpty) return null;

    if (this.size === 1) return this._heap.pop() ?? null;

    const min = this._heap[0];
    this._heap[0] = this._heap.pop()!;
    this.#heapifyDown(0);

    return min;
  }

  delete(value: T) {
    const index = this._getIndex(value);

    if (index === -1) return null;

    if (index === this.size) {
      return this._heap.pop()!;
    }

    this._swap(index, this.size - 1);
    const deleted = this._heap.pop()!;

    if (
      Heap._hasParent(index) &&
      this._compare.lessThan(this._heap[index], this._getParent(index))
    ) {
      this.#heapifyUp(index);
    } else {
      this.#heapifyDown(index);
    }

    return deleted;
  }
}
