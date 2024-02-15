import { LinkedList } from '@/data-structures/linked-list';
import { type Callback } from '@/shared/node';

export class Queue<T = any> {
  #linkedList = new LinkedList<T>();

  // eslint-disable-next-line class-methods-use-this
  get [Symbol.toStringTag]() {
    return 'Queue';
  }

  get size() {
    return this.#linkedList.size;
  }

  get isEmpty() {
    return this.#linkedList.isEmpty;
  }

  enqueue(value: T) {
    this.#linkedList.append(value);

    return this;
  }

  *[Symbol.iterator]() {
    for (const node of this.#linkedList) {
      yield node.data;
    }
  }

  dequeue() {
    return this.#linkedList.deleteHead()?.data;
  }

  peek() {
    return this.#linkedList.head?.data;
  }

  clear() {
    this.#linkedList.clear();
  }

  toString(callback?: Callback<T>) {
    return this.#linkedList.toString(callback);
  }
}
