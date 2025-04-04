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
  #list = new DoublyLinkedList<T>();

  static of<T>(data: T) {
    const deque = new Deque<T>();

    return deque.addRear(data);
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

  addFront(data: T) {
    this.#list.prepend(data);

    return this;
  }

  removeFront() {
    return this.#list.removeHead()?.data ?? null;
  }

  peekFront() {
    return this.#list.head?.data ?? null;
  }

  addRear(data: T) {
    this.#list.append(data);

    return this;
  }

  removeRear() {
    return this.#list.removeTail()?.data ?? null;
  }

  peekRear() {
    return this.#list.tail?.data ?? null;
  }

  toString(callback?: Callback<T>) {
    return this.#list.toString(callback);
  }

  // eslint-disable-next-line class-methods-use-this
  get [Symbol.toStringTag]() {
    return `${this.constructor.name}`;
  }
}
