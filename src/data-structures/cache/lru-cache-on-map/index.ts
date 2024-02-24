interface ILRUCache<Key, Value> {
  get size(): number;
  get(key: Key): Value | null;
  put(key: Key, value: Value): this;
  toArray(): Value[];
}

export class LRUCache<Key = any, Value = any> implements ILRUCache<Key, Value> {
  #capacity: number;

  #cache = new Map<Key, Value>();

  constructor(capacity: number) {
    this.#capacity = capacity;
  }

  get size() {
    return this.#cache.size;
  }

  get(key: Key): Value | null {
    if (!this.#cache.has(key)) return null;

    const value = this.#cache.get(key)!;
    this.#updateAccessOrder(key, value);

    return value;
  }

  put(key: Key, value: Value) {
    if (this.#cache.has(key)) {
      this.#cache.delete(key);
    }

    if (this.#capacity === this.#cache.size) {
      this.#evictLastRecentlyUsed();
    }

    this.#cache.set(key, value);

    return this;
  }

  toArray() {
    return Array.from(this.#cache, ([, value]) => value);
  }

  // eslint-disable-next-line class-methods-use-this
  get [Symbol.toStringTag]() {
    return 'LRUCache';
  }

  #updateAccessOrder(key: Key, value: Value): void {
    this.#cache.delete(key);
    this.#cache.set(key, value);
  }

  #evictLastRecentlyUsed(): void {
    const firstKey = this.#cache.keys().next().value;
    this.#cache.delete(firstKey);
  }
}
