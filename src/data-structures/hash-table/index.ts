import { LinkedList } from '@/data-structures/linked-list';

const INITIAL_CAPACITY = 5;
export class HashTable<Key extends number | string | boolean, Val = any> {
  #capacity = INITIAL_CAPACITY;

  #buckets = createArrayOfLinkedLists(this.#capacity);

  #size = 0;

  // eslint-disable-next-line class-methods-use-this
  get [Symbol.toStringTag]() {
    return 'HashTable';
  }

  get size() {
    return this.#size;
  }

  #hashCode(key: Key) {
    const hash = Array.from(String(key)).reduce<number>(
      (acc, char) => acc + char.charCodeAt(0),
      0,
    );

    return hash % this.#buckets.length;
  }

  #resizeIfNeeded() {
    const RESIZE_THRESHOLD = 0.7;
    const loadFactor = this.#size / this.#buckets.length;
    if (loadFactor < RESIZE_THRESHOLD) return;

    const newCapacity = this.#capacity * 2;
    const newBuckets = createArrayOfLinkedLists(newCapacity);

    // Rehash existing key-value pairs into the new buckets
    for (const bucket of this.#buckets) {
      for (const node of bucket) {
        const { data } = node;

        const newIndex = this.#hashCode(data.key) % this.#buckets.length;
        newBuckets[newIndex].append(data);
      }
    }

    this.#buckets = newBuckets;
    this.#capacity = newCapacity;
  }

  #findBucketByKey(key: Key) {
    const index = this.#hashCode(key);

    return this.#buckets[index] as
      | LinkedList<{ key: Key; value: Val }>
      | undefined;
  }

  set(key: Key, value: Val) {
    this.#resizeIfNeeded();

    const hash = this.#hashCode(key);
    const bucket = this.#buckets[hash];
    const existingNode = bucket.find((pair) => pair.key === key);

    if (existingNode) {
      // Update existing key-value pair.
      existingNode.data.value = value;
    } else {
      // Add new key-value pair.
      bucket.append({
        key,
        value,
      });

      this.#size += 1;
    }

    return this;
  }

  get(key: Key) {
    const bucket = this.#findBucketByKey(key);
    const node = bucket?.find((pair) => pair.key === key);

    return node?.data.value;
  }

  has(key: Key) {
    const bucket = this.#findBucketByKey(key);

    const node = bucket?.find((pair) => pair.key === key);

    return Boolean(node);
  }

  delete(key: Key) {
    const hash = this.#hashCode(key);
    const bucket = this.#buckets[hash];

    if (bucket) {
      const deletedNode = bucket.delete((pair) => pair.key === key);

      if (deletedNode) {
        this.#size -= 1;

        return true;
      }
    }

    return false;
  }

  clear() {
    this.#capacity = INITIAL_CAPACITY;
    this.#buckets = createArrayOfLinkedLists(this.#capacity);
    this.#size = 0;
  }
}

function createArrayOfLinkedLists<Key = any, Val = any>(capacity: number) {
  return Array.from(
    { length: capacity },
    () => new LinkedList<{ key: Key; value: Val }>(),
  );
}
