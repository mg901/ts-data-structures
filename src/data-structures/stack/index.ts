import { SinglyLinkedList } from '@/data-structures/linked-lists/singly-linked-list';
import { type Callback } from '@/shared/node';

interface IStack<T> {
  get isEmpty(): boolean;
  get size(): number;
  push(value: T): this;
  peek(): T | undefined;
  pop(): T | undefined;
  toString(callback?: Callback<T>): string;
  clear(): void;
}

export class Stack<T = any> implements IStack<T> {
  #sll = new SinglyLinkedList<T>();

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

  peek() {
    return this.#sll.tail?.data;
  }

  pop() {
    return this.#sll.deleteTail()?.data;
  }

  clear() {
    this.#sll.clear();
  }

  toString(callback?: Callback<T>) {
    return this.#sll.toString(callback);
  }

  // eslint-disable-next-line class-methods-use-this
  get [Symbol.toStringTag]() {
    return 'Stack';
  }
}
