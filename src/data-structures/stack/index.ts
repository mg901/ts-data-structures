import { SinglyLinkedList } from '@/data-structures/linked-lists/singly-linked-list';
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
  #sll = new SinglyLinkedList<T>();

  static of<T>(data: T) {
    const stack = new Stack<T>().push(data);

    return stack;
  }

  get isEmpty() {
    return this.#sll.isEmpty;
  }

  get size() {
    return this.#sll.size;
  }

  push(data: T) {
    this.#sll.append(data);

    return this;
  }

  peek() {
    if (this.#sll.isEmpty) return null;

    return this.#sll.tail!.data;
  }

  pop() {
    if (this.#sll.isEmpty) return null;

    return this.#sll.deleteTail()!.data;
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
