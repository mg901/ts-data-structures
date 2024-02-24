import { SinglyLinkedList } from '@/data-structures/linked-lists/singly-linked-list';
import { type Callback } from '@/shared/node';

export class Queue<T = any> {
  #sll = new SinglyLinkedList<T>();

  // eslint-disable-next-line class-methods-use-this
  get [Symbol.toStringTag]() {
    return 'Queue';
  }

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

  clear() {
    this.#sll.clear();
  }

  toString(callback?: Callback<T>) {
    return this.#sll.toArrayOfStringifiedNodes(callback).toString();
  }
}
