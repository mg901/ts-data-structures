import { LinkedList } from '../linked-list';
import { type Callback } from '../shared/types';

export class Queue<T = any> {
  #linkedList: LinkedList<T>;

  constructor() {
    this.#linkedList = new LinkedList<T>();
  }

  enqueue(value: T): void {
    this.#linkedList.append(value);
  }

  get size(): number {
    return this.#linkedList.size;
  }

  get isEmpty(): boolean {
    return this.#linkedList.isEmpty;
  }

  toString(callback?: Callback<T>) {
    return this.#linkedList.toString(callback);
  }

  dequeue(): T | undefined {
    return this.#linkedList.deleteHead()?.value;
  }

  peek(): T | undefined {
    return this.#linkedList.head?.value;
  }

  clear(): void {
    this.#linkedList.clear();
  }
}
