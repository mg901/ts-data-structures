import { SinglyLinkedList } from '@/data-structures/linked-lists/singly-linked-list';
import { type Callback } from '@/shared/node';

export class Stack<T = any> {
  #sll = new SinglyLinkedList<T>();

  // eslint-disable-next-line class-methods-use-this
  get [Symbol.toStringTag]() {
    return 'Stack';
  }

  get isEmpty() {
    return this.#sll.isEmpty;
  }

  get size() {
    return this.#sll.size;
  }

  push(value: T) {
    this.#sll.append(value);

    return this;
  }

  pop() {
    return this.#sll.deleteTail()?.data;
  }

  clear() {
    this.#sll.clear();
  }

  toString(callback?: Callback<T>) {
    return this.#sll.toArrayOfStringifiedNodes(callback).toString();
  }
}
