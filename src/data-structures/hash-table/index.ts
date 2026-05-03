import { LinkedList } from '@/data-structures/linked-lists/linked-list';

interface IHashTable<Key, Value> {
  get size(): number;
  set(key: Key, value: Value): this;
  get(key: Key): Value | undefined;
  delete(key: Key): boolean;
  clear(): void;
}

export class HashTable<Key extends PropertyKey, Value = any>
  implements IHashTable<Key, Value>
{
  #INITIAL_CAPACITY = 5;
  #RESIZE_THRESHOLD = 0.75;

  #capacity = this.#INITIAL_CAPACITY;

  #buckets = createBuckets<{ key: Key; value: Value }>(this.#capacity);
  #size = 0;

  get size() {
    return this.#size;
  }

  set(key: Key, value: Value): this {
    this.#checkResize();

    const { bucket, node } = this.#resolve(key);

    if (!node) {
      bucket.append({ key, value });
      this.#size += 1;
    } else {
      node.data.value = value;
    }

    return this;
  }

  get(key: Key): Value | undefined {
    return this.#resolve(key).node?.data.value;
  }

  has(key: Key): boolean {
    return Boolean(this.#resolve(key).node);
  }

  delete(key: Key): boolean {
    const bucket = this.#getBucket(key);

    const deletedNode = bucket.removeByValue((pair) => pair.key === key);

    if (!deletedNode) return false;

    this.#size -= 1;

    return true;
  }

  clear(): void {
    this.#capacity = this.#INITIAL_CAPACITY;
    this.#buckets = createBuckets<{ key: Key; value: Value }>(this.#capacity);
    this.#size = 0;
  }

  get [Symbol.toStringTag]() {
    return 'HashTable';
  }

  // ----------------- internals -----------------

  #resolve(key: Key) {
    const bucket = this.#getBucket(key);
    const node = bucket.find((pair) => pair.key === key);

    return { bucket, node };
  }

  #getBucket(key: Key) {
    return this.#buckets[getHash(key, this.#capacity)];
  }

  #checkResize() {
    const loadFactor = this.#size / this.#capacity;

    if (loadFactor < this.#RESIZE_THRESHOLD) return;

    this.#resize();
  }

  #resize() {
    const oldBuckets = this.#buckets;

    const newCapacity = this.#capacity * 2;
    const newBuckets = createBuckets<{ key: Key; value: Value }>(newCapacity);

    for (const bucket of oldBuckets) {
      for (const node of bucket) {
        const { key, value } = node.data;

        const index = getHash(key, newCapacity);
        newBuckets[index].append({ key, value });
      }
    }

    this.#buckets = newBuckets;
    this.#capacity = newCapacity;
  }
}

// ----------------- helpers -----------------

function getHash<T extends keyof any>(key: T, length: number): number {
  let hash = 0;

  const str = String(key);

  for (let i = 0; i < str.length; i += 1) {
    hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
  }

  return hash % length;
}

function createBuckets<T extends { key: PropertyKey; value: any }>(
  capacity: number,
) {
  const buckets = [];

  for (let i = 0; i < capacity; i += 1) {
    buckets.push(new LinkedList<T>());
  }

  return buckets;
}
