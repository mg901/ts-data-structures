import type { ICache } from '@/data-structures/cache/types';

export class LRUCache<Key extends keyof any, Value = any>
  implements ICache<Key, Value>
{
  #capacity: number;

  #storage = new Map<Key, Value>();

  constructor(capacity: number) {
    this.#capacity = capacity;
  }

  get size() {
    return this.#storage.size;
  }

  put(key: Key, value: Value) {
    if (this.#storage.has(key)) {
      this.#storage.delete(key);
    }

    if (this.#capacity === this.#storage.size) {
      const victim = this.#storage.keys().next().value;
      this.#storage.delete(victim!);
    }

    this.#storage.set(key, value);

    return this;
  }

  get(key: Key): Value | null {
    if (!this.#storage.has(key)) return null;

    this.#updateAccessOrderByKey(key);

    return this.#storage.get(key)!;
  }

  #updateAccessOrderByKey(key: Key) {
    const value = this.#storage.get(key)!;

    this.#storage.delete(key);
    this.#storage.set(key, value);
  }

  clear() {
    this.#storage.clear();
  }
}
