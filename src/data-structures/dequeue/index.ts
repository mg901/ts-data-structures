import { type Callback } from '@/shared/node';
import { DoublyLinkedList } from '../linked-lists/doubly-linked-list';

export class Dequeue<T = any> {
  #dll = new DoublyLinkedList<T>();

  get size() {
    return this.#dll.size;
  }

  get isEmpty() {
    return this.#dll.isEmpty;
  }

  addFront(value: T) {
    this.#dll.prepend(value);

    return this;
  }

  removeFront() {
    return this.#dll.deleteHead();
  }

  peekFront() {
    return this.#dll.head;
  }

  addRear(value: T) {
    this.#dll.append(value);

    return this;
  }

  removeRear() {
    return this.#dll.deleteTail();
  }

  peekRear() {
    return this.#dll.tail;
  }

  toString(callback?: Callback<T>) {
    return this.#dll.toString(callback);
  }

  // eslint-disable-next-line class-methods-use-this
  get [Symbol.toStringTag]() {
    return 'Dequeue';
  }
}
