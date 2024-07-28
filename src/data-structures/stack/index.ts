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
  #dll = new DoublyLinkedList<T>();

  static of<T>(data: T) {
    const stack = new Stack<T>().push(data);

    return stack;
  }

  get isEmpty() {
    return this.#dll.isEmpty;
  }

  get size() {
    return this.#dll.size;
  }

  push(data: T) {
    this.#dll.append(data);

    return this;
  }

  peek() {
    if (this.#dll.isEmpty) return null;

    return this.#dll.tail!.data;
  }

  pop() {
    if (this.#dll.isEmpty) return null;

    return this.#dll.deleteTail()!.data;
  }

  clear() {
    this.#dll.clear();
  }

  toString(callback?: Callback<T>) {
    return this.#dll.toString(callback);
  }

  // eslint-disable-next-line class-methods-use-this
  get [Symbol.toStringTag]() {
    return 'Stack';
  }
}
