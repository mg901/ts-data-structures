import { LinkedList } from '../linked-list';

export class Queue<T = any> {
  #linkedList: LinkedList<T>;

  constructor() {
    this.#linkedList = new LinkedList<T>();
  }

  get size(): number {
    return this.#linkedList.length;
  }

  get isEmpty(): boolean {
    return this.#linkedList.isEmpty;
  }

  enqueue(value: T): void {
    this.#linkedList.append(value);
  }

  dequeue(): T | undefined {
    return this.#linkedList.deleteHead()?.value;
  }

  pick(): T | undefined {
    return this.#linkedList.head?.value;
  }

  clear(): void {
    this.#linkedList.clear();
  }
}
