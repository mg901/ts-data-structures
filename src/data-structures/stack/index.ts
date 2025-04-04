import { DoublyLinkedList } from '@/data-structures/linked-lists/doubly-linked-list';
import { type Callback } from '@/shared/node';
import { Nullable } from '@/shared/types';

interface IStack<T> {
  get isEmpty(): boolean;
  get size(): number;
  push(data: T): this;
  peek(): Nullable<T>;
  pop(): Nullable<T>;
  clear(): void;
  toString(callback?: Callback<T>): string;
}

export class Stack<T = any> implements IStack<T> {
  #list = new DoublyLinkedList<T>();

  static of<T>(data: T) {
    const stack = new Stack<T>();

    return stack.push(data);
  }

  get isEmpty() {
    return this.#list.isEmpty;
  }

  get size() {
    return this.#list.size;
  }

  *[Symbol.iterator]() {
    for (const node of this.#list) {
      yield node.data;
    }
  }

  push(data: T) {
    this.#list.append(data);

    return this;
  }

  peek() {
    return this.#list.tail?.data ?? null;
  }

  pop() {
    return this.#list.removeTail()?.data ?? null;
  }

  clear() {
    this.#list.clear();
  }

  toString(callback?: Callback<T>) {
    return this.#list.toString(callback);
  }

  // eslint-disable-next-line class-methods-use-this
  get [Symbol.toStringTag]() {
    return `${this.constructor.name}`;
  }
}
