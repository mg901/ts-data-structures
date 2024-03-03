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

  get isEmpty() {
    return this.toArray().length === 0;
  }

  toArray() {
    return Array.from(this.#storage, ([, value]) => value);
  }

  put(key: Key, value: Value) {
    if (this.#storage.has(key)) {
      this.#storage.delete(key);
    }

    if (this.#capacity === this.#storage.size) {
      this.#evictLeastRecentItem();
    }

    this.#storage.set(key, value);

    return this;
  }

  #evictLeastRecentItem() {
    const firstKey = this.#storage.keys().next().value;
    this.#storage.delete(firstKey);
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

  // eslint-disable-next-line class-methods-use-this
  get [Symbol.toStringTag]() {
    return 'LRUCache';
  }
}
