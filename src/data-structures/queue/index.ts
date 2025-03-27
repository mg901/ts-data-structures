import { LinkedList } from '@/data-structures/linked-lists/linked-list';
import { type Callback } from '@/shared/node';
import { Nullable } from '@/shared/types';

interface IQueue<T> {
  get size(): number;
  get isEmpty(): boolean;
  enqueue(value: T): this;
  dequeue(value: T): Nullable<T>;
  peek(value: T): Nullable<T>;
  clear(): void;
  toArray(): T[];
  toString(callback?: Callback<T>): string;
}

export class Queue<T = any> implements IQueue<T> {
  #sll = new LinkedList<T>();

  static of<T>(value: T) {
    const queue = new Queue<T>();

    return queue.enqueue(value);
  }

  get size() {
    return this.#sll.size;
  }

  get isEmpty() {
    return this.#sll.isEmpty;
  }

  *[Symbol.iterator]() {
    for (const node of this.#sll) {
      yield node.data;
    }
  }

  enqueue(value: T) {
    this.#sll.append(value);

    return this;
  }

  dequeue() {
    if (this.#sll.head) {
      return this.#sll.deleteHead()!.data;
    }

    return null;
  }

  peek() {
    if (this.#sll.head) {
      return this.#sll.head.data;
    }

    return null;
  }

  toArray() {
    return this.#sll.toArray();
  }

  clear() {
    this.#sll.clear();
  }

  toString(callback?: Callback<T>) {
    return this.#sll.toString(callback);
  }

  // eslint-disable-next-line class-methods-use-this
  get [Symbol.toStringTag]() {
    return 'Queue';
  }
}
