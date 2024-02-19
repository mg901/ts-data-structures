import { Primitive } from 'utility-types';

export class LFUCache<Key extends Primitive, Value = any> {
  #capacity: number;

  #size = 0;

  constructor(capacity: number) {
    this.#capacity = capacity;
  }

  get size() {
    return this.#size;
  }

  // @ts-ignore
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, class-methods-use-this
  get(key: Key) {}

  // @ts-ignore
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  put(key: Key, value: Value) {
    this.#size += 1;

    if (this.#size > this.#capacity) {
      this.#size -= 1;
    }

    return this;
  }
}
