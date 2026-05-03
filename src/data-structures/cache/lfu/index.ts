/* eslint-disable max-classes-per-file */
import type { ICache, Payload } from '@/data-structures/cache/types';
import {
  DoublyLinkedList,
  DoublyLinkedListNode,
} from '@/data-structures/linked-lists/doubly-linked-list';

export class LFUCache<Key extends keyof any, Value>
  implements ICache<Key, Value>
{
  #capacity: number;

  #storage = new Storage<Key, Value>();

  constructor(capacity: number) {
    this.#capacity = capacity;
  }

  get size() {
    return this.#storage.size;
  }

  put(key: Key, value: Value) {
    const storage = this.#storage;

    if (storage.hasItem(key)) {
      storage.removeItem(key);
    }

    if (storage.size === this.#capacity) {
      storage.evictLeastFrequentlyUsed();
    }

    storage.setItem(key, value);

    return this;
  }

  get(key: Key) {
    const storage = this.#storage;

    if (!storage.hasItem(key)) return null;

    const node = storage.getItem(key)!;
    storage.removeItem(key);

    storage.setItem(key, node.data.value);

    return node.data.value;
  }

  clear() {
    this.#storage.clear();
  }
}

const INITIAL_MIN_FREQUENCY_VALUE = 1;

class Storage<Key extends keyof any, Value> {
  #keyFrequencyMap = new Map<Key, number>();

  #frequencyBuckets = {} as Record<
    number,
    DoublyLinkedList<Payload<Key, Value>>
  >;

  #keyNodeMap = new Map<Key, DoublyLinkedListNode<Payload<Key, Value>>>();

  #currentMinFrequency = INITIAL_MIN_FREQUENCY_VALUE;

  get size() {
    return this.#keyNodeMap.size;
  }

  get store() {
    return this.#frequencyBuckets;
  }
  getItem(key: Key) {
    const node = this.#keyNodeMap.get(key);
    if (!node) return null;

    this.#updateFrequency(key, node);

    return node;
  }

  setItem(key: Key, value: Value) {
    if (this.#keyNodeMap.has(key)) {
      const node = this.#keyNodeMap.get(key)!;
      node.data.value = value;

      this.#updateFrequency(key, node);

      return;
    }

    const frequency = INITIAL_MIN_FREQUENCY_VALUE;
    const bucket = this.#getOrCreateBucket(frequency);

    bucket.append({ key, value });
    this.#frequencyBuckets[frequency] = bucket;

    const newNode = bucket.tail!;
    this.#keyNodeMap.set(key, newNode);
    this.#keyFrequencyMap.set(key, frequency);

    this.#currentMinFrequency = INITIAL_MIN_FREQUENCY_VALUE;
  }

  #updateFrequency(key: Key, node: DoublyLinkedListNode<Payload<Key, Value>>) {
    const oldFreq = this.#keyFrequencyMap.get(key)!;
    const oldBucket = this.#frequencyBuckets[oldFreq];

    oldBucket.deleteByRef(node);

    if (oldBucket.isEmpty && this.#currentMinFrequency === oldFreq) {
      this.#currentMinFrequency += 1;
    }

    const newFreq = oldFreq + 1;
    const newBucket = this.#getOrCreateBucket(newFreq);

    newBucket.append(node.data);
    this.#frequencyBuckets[newFreq] = newBucket;

    const newNode = newBucket.tail!;
    this.#keyNodeMap.set(key, newNode);
    this.#keyFrequencyMap.set(key, newFreq);
  }

  #getOrCreateBucket(frequency: number) {
    return this.#frequencyBuckets[frequency] ?? new DoublyLinkedList();
  }

  hasItem(key: Key) {
    return this.#keyNodeMap.has(key);
  }

  removeItem(key: Key) {
    const node = this.#keyNodeMap.get(key)!;
    const frequency = this.#keyFrequencyMap.get(key)!;
    const bucket = this.#frequencyBuckets[frequency];

    bucket.deleteByRef(node);
    this.#keyNodeMap.delete(key);

    if (bucket.isEmpty && frequency === this.#currentMinFrequency) {
      this.#currentMinFrequency += 1;
    }
  }

  evictLeastFrequentlyUsed() {
    const minFreq = this.#currentMinFrequency;
    const bucket = this.#frequencyBuckets[minFreq];

    const victim = bucket.removeHead()!;

    const { key } = victim.data;
    this.#keyNodeMap.delete(key);
    this.#keyFrequencyMap.delete(key);
  }

  clear() {
    this.#frequencyBuckets = {};
    this.#keyNodeMap.clear();
    this.#keyFrequencyMap.clear();
    this.#currentMinFrequency = INITIAL_MIN_FREQUENCY_VALUE;
  }
}
