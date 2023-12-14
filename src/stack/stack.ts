import { LinkedList } from '../linked-list';
import { type Callback } from '../shared/types';

export class Stack<T> {
  #linkedList: LinkedList;

  constructor() {
    this.#linkedList = new LinkedList();
  }

  push(value: T): void {
    this.#linkedList.prepend(value);
  }

  get isEmpty() {
    return this.#linkedList.isEmpty;
  }

  get size() {
    return this.#linkedList.size;
  }

  toString(callback?: Callback<T>) {
    return this.#linkedList.toString(callback);
  }

  pop(): T | undefined {
    return this.#linkedList.deleteHead()?.value;
  }

  clear(): void {
    this.#linkedList.clear();
  }
}
