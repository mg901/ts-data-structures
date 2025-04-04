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

  #RESIZE_THRESHOLD = 0.7;

  #capacity = this.#INITIAL_CAPACITY;

  #buckets = createBuckets<{
    key: Key;
    value: Value;
  }>(this.#capacity);

  #size = 0;

  get size() {
    return this.#size;
  }

  #checkResize() {
    const loadFactor = this.#size / this.#buckets.length;
    if (loadFactor < this.#RESIZE_THRESHOLD) return;

    this.#resize();
  }

  #resize() {
    const newCapacity = this.#capacity * 2;
    const newBuckets = createBuckets<{ key: Key; value: Value }>(newCapacity);

    // Rehash existing key-value pairs into the new buckets
    for (const bucket of this.#buckets) {
      for (const node of bucket) {
        const { data } = node;

        const index = getHash(data.key as Key, newCapacity);

        newBuckets[index].append(data);
      }
    }

    this.#buckets = newBuckets;
    this.#capacity = newCapacity;
  }

  #getBucket(key: Key) {
    return this.#buckets[getHash(key, this.#capacity)];
  }

  set(key: Key, value: Value): this {
    this.#checkResize();

    const bucket = this.#getBucket(key);
    const node = bucket.find((pair) => pair.key === key);

    if (!node) {
      bucket.append({ key, value });

      this.#size += 1;
    } else {
      node.data.value = value;
    }

    return this;
  }

  #findNode(key: Key) {
    return this.#getBucket(key).find((pair) => pair.key === key);
  }

  get(key: Key): Value | undefined {
    return this.#findNode(key)?.data.value as Value | undefined;
  }

  has(key: Key): boolean {
    return Boolean(this.#findNode(key));
  }

  delete(key: Key): boolean {
    const bucket = this.#getBucket(key);
    const deletedNode = bucket.removeByValue((pair) => pair.key === key);

    if (deletedNode) {
      this.#size -= 1;

      return true;
    }

    return false;
  }

  clear(): void {
    this.#capacity = this.#INITIAL_CAPACITY;
    this.#buckets = createBuckets<{ key: Key; value: Value }>(this.#capacity);
    this.#size = 0;
  }

  // eslint-disable-next-line class-methods-use-this
  get [Symbol.toStringTag]() {
    return 'HashTable';
  }
}

function getHash<T extends keyof any>(key: T, length: number): number {
  const hash = Array.from(String(key)).reduce<number>(
    (acc, char) => acc + char.charCodeAt(0),
    0,
  );

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
