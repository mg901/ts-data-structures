/* eslint-disable no-irregular-whitespace */
/*

In JavaScript, the terms "HashMap" and "HashTable" are often used interchangeably, but there can be some historical and conceptual differences between the two.

HashMap:
• The term "HashMap" is commonly used in the context of dynamic languages like JavaScript.
• In JavaScript, objects and maps are often referred to as hash maps.
• The Map object in JavaScript is a modern implementation of a hash map, allowing you to store key-value pairs where both keys and values can be of any type.
• Map provides better flexibility and additional methods compared to the older Object for handling key-value data.
• It uses a hash function to map keys to indices in the underlying data structure.

HashTable:
• The term "HashTable" is a more generic term and is used in computer science to describe a data structure that implements an associative array abstract data type. Historically, in languages like Java, the term "HashTable" is often associated with the HashTable class, which is part of the Java Collections Framework.
• The HashTable class in Java is synchronized, meaning it is thread-safe, but this can result in performance overhead. It's recommended to use the more modern HashMap if thread safety is not a concern.
• In other languages, the term "HashTable" might be used to describe a generic key-value store with hash-based access.

In summary, while there may be historical differences between the terms in certain languages, in modern JavaScript, the distinction is less pronounced. The Map object is commonly referred to as a hash map, and the term "HashTable" may be less commonly used in the context of JavaScript due to the prevalence of Map and Object for handling key-value data.
*/
import { LinkedList } from '@/linked-list';

const INITIAL_CAPACITY = 10;

type KeyValuePair<K, V> = {
  key: K;
  value: V;
};

export class HashMap<K = any, V = any> {
  #capacity: number;

  #buckets: LinkedList<KeyValuePair<K, V>>[] = [];

  #size: number = 0;

  constructor(capacity = INITIAL_CAPACITY) {
    this.#capacity = capacity;
  }

  get size() {
    return this.#size;
  }

  #hashCode(key: K): number {
    const hashString = String(key);

    const prime = 31;
    let hash = 0;

    for (let i = 0; i < hashString.length; i += 1) {
      const codePoint = hashString.codePointAt(i);
      if (codePoint === undefined) {
        break; // Invalid Unicode character.
      }

      hash = (hash * prime + codePoint) % this.#buckets.length;
      // Move to the next code point.
      i += codePoint >= 0x10000 ? 2 : 1;
    }

    return hash;
  }

  #resizeIfNeeded(): void {
    const RESIZE_THRESHOLD = 0.7;
    const loadFactor = this.#size / this.#buckets.length;
    if (loadFactor < RESIZE_THRESHOLD) return;

    const newCapacity = this.#capacity * 2;
    const newBuckets = createArrayOfLinkedLists(newCapacity);

    // Rehash existing key-value pairs into the new buckets
    for (const bucket of this.#buckets) {
      let currentNode = bucket.head;

      while (currentNode !== null) {
        const pair = currentNode.value;
        const newIndex = this.#hashCode(pair.key) % this.#buckets.length;
        newBuckets[newIndex].append(pair);

        currentNode = currentNode.next;
      }
    }

    this.#buckets = newBuckets;
    this.#capacity = newCapacity;
  }

  #findBucketByKey(key: K) {
    const index = this.#hashCode(key);

    return this.#buckets[index];
  }

  set(key: K, value: V): this {
    this.#resizeIfNeeded();

    const hash = this.#hashCode(key);
    const bucket = this.#buckets[hash] || new LinkedList<KeyValuePair<K, V>>();
    const existingNode = bucket.find((pair) => pair.key === key);

    if (existingNode) {
      // Update existing key-value pair.
      existingNode.value.value = value;
    } else {
      // Add new key-value pair.
      bucket.append({ key, value });
      this.#size += 1;

      if (this.#buckets[hash] === undefined) {
        this.#buckets[hash] = bucket;
      }
    }

    return this;
  }

  get(key: K) {
    const bucket = this.#findBucketByKey(key);

    const node = bucket.find((pair) => pair.key === key);

    return node?.value.value;
  }

  has(key: K) {
    const bucket = this.#findBucketByKey(key);

    const node = bucket.find((pair) => pair.key === key);

    return Boolean(node);
  }

  delete(key: K): boolean {
    const hash = this.#hashCode(key);
    const bucket = this.#buckets[hash];

    if (bucket) {
      const deletedNode = bucket.deleteByValue((pair) => pair.key === key);

      if (deletedNode) {
        this.#size -= 1;

        return true;
      }
    }

    return false;
  }

  *keys() {
    for (const bucket of this.#buckets) {
      let currentNode = bucket.head;

      while (currentNode !== null) {
        const pair = currentNode.value;

        yield pair.key;
        currentNode = currentNode.next;
      }
    }
  }

  *values() {
    for (const bucket of this.#buckets) {
      let currentNode = bucket.head;

      while (currentNode !== null) {
        const pair = currentNode.value;

        yield pair.value;
        currentNode = currentNode.next;
      }
    }
  }

  *entries() {
    for (const bucket of this.#buckets) {
      let currentNode = bucket.head;

      while (currentNode !== null) {
        const pair = currentNode.value;

        yield [pair.key, pair.value];
        currentNode = currentNode.next;
      }
    }
  }
}

function createArrayOfLinkedLists<K = any, V = any>(capacity: number) {
  return Array.from(
    { length: capacity },
    () => new LinkedList<KeyValuePair<K, V>>(),
  );
}
