import type { ICache } from '../../types';

export class LRUCache<Key = any, Value = any> implements ICache<Key, Value> {
  #capacity: number;

  #cache = new Map<Key, Value>();

  constructor(capacity: number) {
    this.#capacity = capacity;
  }

  get size() {
    return this.#cache.size;
  }

  get isEmpty() {
    return this.toArray().length === 0;
  }

  toArray() {
    return Array.from(this.#cache, ([, value]) => value);
  }

  put(key: Key, value: Value) {
    if (this.#cache.has(key)) {
      this.#cache.delete(key);
    }

    if (this.#capacity === this.#cache.size) {
      this.#evictLeastRecentlyUsed();
    }

    this.#cache.set(key, value);

    return this;
  }

  #evictLeastRecentlyUsed() {
    const firstKey = this.#cache.keys().next().value;
    this.#cache.delete(firstKey);
  }

  get(key: Key): Value | null {
    if (!this.#cache.has(key)) return null;

    this.#updateAccessOrderByKey(key);

    return this.#cache.get(key)!;
  }

  #updateAccessOrderByKey(key: Key) {
    const value = this.#cache.get(key)!;

    this.#cache.delete(key);
    this.#cache.set(key, value);
  }

  clear() {
    this.#cache.clear();
  }

  // eslint-disable-next-line class-methods-use-this
  get [Symbol.toStringTag]() {
    return 'LRUCache';
  }
}
