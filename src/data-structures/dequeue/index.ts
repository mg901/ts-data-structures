import { type Callback } from '@/shared/node';
import { Nullable } from '@/shared/types';
import { DoublyLinkedList } from '../linked-lists/doubly-linked-list';

interface IDequeue<T> {
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
export class Dequeue<T = any> implements IDequeue<T> {
  #dll = new DoublyLinkedList<T>();

  static of<T>(data: T) {
    const dequeue = new Dequeue<T>().addRear(data);

    return dequeue;
  }

  get size() {
    return this.#dll.size;
  }

  get isEmpty() {
    return this.#dll.isEmpty;
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
    return 'Dequeue';
  }
}
