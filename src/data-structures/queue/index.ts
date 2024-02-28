import { SinglyLinkedList } from '@/data-structures/linked-lists/singly-linked-list';
import { type Callback } from '@/shared/node';

interface IQueue<T> {
  get size(): number;
  get isEmpty(): boolean;
  enqueue(value: T): this;
  dequeue(value: T): T | undefined;
  peek(value: T): T | undefined;
  clear(): void;
  toArray(): T[];
  toString(): string;
}

export class Queue<T = any> implements IQueue<T> {
  #sll = new SinglyLinkedList<T>();

  get size() {
    return this.#sll.size;
  }

  get isEmpty() {
    return this.#sll.isEmpty;
  }

  enqueue(value: T) {
    this.#sll.append(value);

    return this;
  }

  *[Symbol.iterator]() {
    for (const node of this.#sll) {
      yield node.data;
    }
  }

  dequeue() {
    return this.#sll.deleteHead()?.data;
  }

  peek() {
    return this.#sll.head?.data;
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
