import { LinkedList } from '@/data-structures/linked-list';
import { type Callback } from '@/shared/node';

export class Queue<T = any> {
  #linkedList: LinkedList<T>;

  constructor() {
    this.#linkedList = new LinkedList<T>();
  }

  *[Symbol.iterator]() {
    for (const node of this.#linkedList) {
      yield node.data;
    }
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
