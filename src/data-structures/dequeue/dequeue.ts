import { DoublyLinkedList } from '../doubly-linked-list';

export class Dequeue<T = any> {
  #list = new DoublyLinkedList<T>();

  get size() {
    return this.#list.size;
  }

  addFront(value: T) {
    this.#list.prepend(value);

    return this;
  }

  peekFront() {
    return this.#list.head;
  }

  removeFront() {
    return this.#list.deleteHead();
  }
}
