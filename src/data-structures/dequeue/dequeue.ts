import { type Callback } from '@/shared/base-linked-list-node';
import { DoublyLinkedList } from '../doubly-linked-list';

export class Dequeue<T = any> {
  #list: DoublyLinkedList<T>;

  constructor() {
    this.#list = new DoublyLinkedList<T>();
  }

  get size() {
    return this.#list.size;
  }

  get isEmpty() {
    return this.#list.isEmpty;
  }

  toString(callback?: Callback<T>) {
    return this.#list.toString(callback);
  }

  addFront(value: T) {
    this.#list.prepend(value);

    return this;
  }

  removeFront() {
    return this.#list.deleteHead();
  }

  peekFront() {
    return this.#list.head;
  }

  addRear(value: T) {
    this.#list.append(value);

    return this;
  }

  removeRear() {
    return this.#list.deleteTail();
  }

  peekRear() {
    return this.#list.tail;
  }
}