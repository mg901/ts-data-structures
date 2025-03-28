import { Heap } from '../heap';

export class MinHeap<T> extends Heap<T> {
  static of<T>(value: T) {
    const minHeap = new MinHeap<T>();
    minHeap.insert(value);

    return minHeap;
  }

  insert(value: T) {
    this._heap.push(value);
    this.#heapifyUp(this.size - 1);

    return this;
  }

  #heapifyUp(index: number) {
    while (
      index > 0 &&
      this._compare.lessThan(this._heap[index], this._getParent(index))
    ) {
      const parentIndex = this._calcParentIndex(index);
      this._swap(index, parentIndex);

      index = parentIndex;
    }
  }

  poll() {
    const { length } = this._heap;

    if (length === 0) return null;
    if (length === 1) return this._heap.pop() ?? null;

    const min = this._heap[0];
    this._heap[0] = this._heap.pop()!;
    this.#heapifyDown();

    return min;
  }

  #heapifyDown(index: number = 0) {
    // eslint-disable-next-line no-constant-condition
    while (true) {
      let smallest = index;

      // Check left child
      if (
        this._hasLeftChild(index) &&
        this._compare.lessThan(this._getLeftChild(index), this._heap[smallest])
      ) {
        smallest = this._calcLeftChildIndex(index);
      }

      // Check right child
      if (
        this._hasRightChild(index) &&
        this._compare.lessThan(this._getRightChild(index), this._heap[smallest])
      ) {
        smallest = this._calcRightChildIndex(index);
      }

      if (smallest === index) break;

      this._swap(smallest, index);

      index = smallest;
    }
  }

  delete(predicate: (value: T, index: number, obj: T[]) => unknown) {
    const index = this._findIndex(predicate);

    if (index === -1) return null;

    if (index === this.size - 1) {
      return this._heap.pop()!;
    }

    this._swap(index, this.size - 1);
    const deleted = this._heap.pop()!;

    if (index > 0) {
      this.#heapifyUp(index);
    } else {
      this.#heapifyDown();
    }

    return deleted;
  }
}
