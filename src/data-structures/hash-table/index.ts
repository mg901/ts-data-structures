import { SinglyLinkedList } from '@/data-structures/linked-lists/singly-linked-list';

interface IHashTable<Key, Value> {
  get size(): number;
  set(key: Key, value: Value): this;
  get(key: Key): Value | undefined;
  delete(key: Key): boolean;
  clear(): void;
}

export class HashTable<Key extends keyof any, Value = any>
  implements IHashTable<Key, Value>
{
  #INITIAL_CAPACITY = 5;

  #capacity = this.#INITIAL_CAPACITY;

  #buckets = createArrayOfLinkedLists(this.#capacity);

  #size = 0;

  get size() {
    return this.#size;
  }

  #getBucketByKey(key: Key) {
    const index = getHash(key, this.#capacity);

    return this.#buckets[index];
  }

  set(key: Key, value: Value): this {
    this.#checkResize();

    const bucket = this.#getBucketByKey(key);
    const node = bucket?.find((pair) => pair.key === key);

    if (!node) {
      // Add new key-value pair.
      bucket.append({
        key,
        value,
      });

      this.#size += 1;
    } else {
      // Update existing key-value pair.
      node.data.value = value;
    }

    return this;
  }

  #checkResize() {
    const RESIZE_THRESHOLD = 0.7;
    const loadFactor = this.#size / this.#buckets.length;
    if (loadFactor < RESIZE_THRESHOLD) return;

    this.#resize();
  }

  #resize() {
    const newCapacity = this.#capacity * 2;
    const newBuckets = createArrayOfLinkedLists(newCapacity);

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

  get(key: Key): Value | undefined {
    const bucket = this.#getBucketByKey(key);
    const node = bucket?.find((pair) => pair.key === key);

    return node?.data.value as Value | undefined;
  }

  has(key: Key): boolean {
    const bucket = this.#getBucketByKey(key);
    const node = bucket?.find((pair) => pair.key === key);

    return Boolean(node);
  }

  delete(key: Key): boolean {
    const deletedNode = this.#getBucketByKey(key)?.deleteByValue(
      (pair) => pair.key === key,
    );

    if (deletedNode) {
      this.#size -= 1;

      return true;
    }

    return false;
  }

  clear(): void {
    this.#capacity = this.#INITIAL_CAPACITY;
    this.#buckets = createArrayOfLinkedLists(this.#capacity);
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

function createArrayOfLinkedLists<Key = any, Val = any>(capacity: number) {
  return Array.from(
    { length: capacity },
    () => new SinglyLinkedList<{ key: Key; value: Val }>(),
  );
}
