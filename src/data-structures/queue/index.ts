import { LinkedList } from '@/data-structures/linked-lists/linked-list';
import { type Callback } from '@/shared/node';
import { Nullable } from '@/shared/types';

interface IQueue<T> {
  get size(): number;
  get isEmpty(): boolean;
  enqueue(value: T): this;
  dequeue(value: T): Nullable<T>;
  front(value: T): Nullable<T>;
  clear(): void;
  toArray(): T[];
  toString(callback?: Callback<T>): string;
}

export class Queue<T = any> implements IQueue<T> {
  #list = new LinkedList<T>();

  static of<T>(value: T) {
    const queue = new Queue<T>();

    return queue.enqueue(value);
  }

  get size() {
    return this.#list.size;
  }

  get isEmpty() {
    return this.#list.isEmpty;
  }

  *[Symbol.iterator]() {
    for (const node of this.#list) {
      yield node.data;
    }
  }

  enqueue(value: T) {
    this.#list.append(value);

    return this;
  }

  dequeue() {
    return this.#list.removeHead()?.data ?? null;
  }

  front() {
    return this.#list.head?.data ?? null;
  }

  back() {
    return this.#list.tail?.data ?? null;
  }

  toArray() {
    return this.#list.toArray();
  }

  clear() {
    this.#list.clear();
  }

  toString(callback?: Callback<T>) {
    return this.#list.toString(callback);
  }

  // eslint-disable-next-line class-methods-use-this
  get [Symbol.toStringTag]() {
    return `${this.constructor.name}`;
  }
}
