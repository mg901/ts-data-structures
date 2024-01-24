import { type Callback } from '@/shared/base-linked-list';
import { LinkedList } from '@/data-structures/linked-list';

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
    return this.#linkedList.deleteHead()?.data;
  }

  peek(): T | undefined {
    return this.#linkedList.head?.data;
  }

  clear(): void {
    this.#linkedList.clear();
  }
}
