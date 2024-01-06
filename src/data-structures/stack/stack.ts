import { type Callback } from '@/shared/base-linked-list';
import { LinkedList } from '@/data-structures/linked-list';

export class Stack<T = any> {
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
    return this.#linkedList.toString(callback as Callback<T>);
  }

  pop(): T | undefined {
    return this.#linkedList.deleteHead()?.value;
  }

  clear(): void {
    this.#linkedList.clear();
  }
}
