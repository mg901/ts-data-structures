import { type Callback } from '@/shared/base-linked-list';
import { DoublyLinkedList } from '../doubly-linked-list';

export class Dequeue<T = any> {
  #list = new DoublyLinkedList<T>();

  get size() {
    return this.#list.size;
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
}
