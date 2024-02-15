import { LinkedList } from '@/data-structures/linked-list';
import { type Callback } from '@/shared/node';

export class Stack<T = any> {
  #linkedList = new LinkedList<T>();

  // eslint-disable-next-line class-methods-use-this
  get [Symbol.toStringTag]() {
    return 'Stack';
  }

  get isEmpty() {
    return this.#linkedList.isEmpty;
  }

  get size() {
    return this.#linkedList.size;
  }

  push(value: T) {
    this.#linkedList.append(value);

    return this;
  }

  pop() {
    return this.#linkedList.deleteTail()?.data;
  }

  clear() {
    this.#linkedList.clear();
  }

  toString(callback?: Callback<T>) {
    return this.#linkedList.toString(callback);
  }
}
