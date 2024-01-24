import { type Callback } from '@/shared/base-linked-list';
import { LinkedList } from '@/data-structures/linked-list';

export class Queue<T = any> {
  #linkedList: LinkedList<T>;

  constructor() {
    this.#linkedList = new LinkedList<T>();
  }

  enqueue(value: T) {
    this.#linkedList.append(value);
  }

  get size() {
    return this.#linkedList.size;
  }

  get isEmpty() {
    return this.#linkedList.isEmpty;
  }

  toString(callback?: Callback<T>) {
    return this.#linkedList.toString(callback);
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
}
