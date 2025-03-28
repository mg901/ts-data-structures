import { type Callback } from '@/shared/node';
import { Nullable } from '@/shared/types';
import { DoublyLinkedList } from '../linked-lists/doubly-linked-list';

interface IDeque<T> {
  get size(): number;
  get isEmpty(): boolean;
  addFront(data: T): this;
  removeFront(): Nullable<T>;
  peekFront(): Nullable<T>;
  addRear(data: T): this;
  removeRear(): Nullable<T>;
  peekRear(): Nullable<T>;
  toString(callback?: Callback<T>): string;
}
export class Deque<T = any> implements IDeque<T> {
  #dll = new DoublyLinkedList<T>();

  static of<T>(data: T) {
    const deque = new Deque<T>();

    return deque.addRear(data);
  }

  get size() {
    return this.#dll.size;
  }

  get isEmpty() {
    return this.#dll.isEmpty;
  }

  *[Symbol.iterator]() {
    for (const node of this.#dll) {
      yield node.data;
    }
  }

  addFront(data: T) {
    this.#dll.prepend(data);

    return this;
  }

  removeFront() {
    if (this.#dll.isEmpty) return null;

    return this.#dll.deleteHead()!.data;
  }

  peekFront() {
    if (this.#dll.isEmpty) return null;

    return this.#dll.head!.data;
  }

  addRear(data: T) {
    this.#dll.append(data);

    return this;
  }

  removeRear() {
    if (this.#dll.isEmpty) return null;

    return this.#dll.deleteTail()!.data;
  }

  peekRear() {
    if (this.#dll.isEmpty) return null;

    return this.#dll.tail!.data;
  }

  toString(callback?: Callback<T>) {
    return this.#dll.toString(callback);
  }

  // eslint-disable-next-line class-methods-use-this
  get [Symbol.toStringTag]() {
    return 'Deque';
  }
}
