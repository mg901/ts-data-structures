export class LRUCache<Key = any, Value = any> {
  #capacity: number;

  #cache = new Map<Key, Value>();

  constructor(capacity: number) {
    this.#capacity = capacity;
  }

  // eslint-disable-next-line class-methods-use-this
  get [Symbol.toStringTag]() {
    return 'LRUCache';
  }

  get(key: Key): Value | -1 {
    if (!this.#cache.has(key)) return -1;

    const value = this.#cache.get(key)!;
    this.#cache.delete(key);
    this.#cache.set(key, value);

    return value;
  }

  put(key: Key, value: Value) {
    if (this.#cache.has(key)) {
      this.#cache.delete(key);
    }

    if (this.#capacity === this.#cache.size) {
      const firstKey = this.#cache.keys().next().value;
      this.#cache.delete(firstKey);
    }

    this.#cache.set(key, value);
  }
}
