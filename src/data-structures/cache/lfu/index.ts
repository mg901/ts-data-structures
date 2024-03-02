/* eslint-disable max-classes-per-file */
import type { ICache } from '@/data-structures/cache/types';
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

  toArray() {
    return Object.values(this.#storage.frequencyBuckets)
      .flatMap((list) => list?.toArray())
      .map((pair) => pair.value);
  }

  get isEmpty() {
    return this.toArray().length === 0;
  }

  put(key: Key, value: Value) {
    const storage = this.#storage;

    if (storage.hasItem(key)) {
      storage.deleteItem(key);
    }

    if (storage.size === this.#capacity) {
      storage.evictLeastFrequent();
    }

    storage.addItem(key, value);

    return this;
  }

  get(key: Key) {
    const storage = this.#storage;

    if (!storage.hasItem(key)) return null;

    const node = storage.getItem(key)!;
    storage.deleteItem(key);

    storage.addItem(key, node.data.value);

    return node.data.value;
  }

  clear() {
    this.#storage.clear();
  }

  // eslint-disable-next-line class-methods-use-this
  get [Symbol.toStringTag]() {
    return 'LFUCache';
  }
}

type FrequencyBucket<Key, Value> = DoublyLinkedList<{ key: Key; value: Value }>;
type Node<Key, Value> = DoublyLinkedListNode<{ key: Key; value: Value }>;

class Storage<Key extends keyof any, Value> {
  #keyFrequencyMap = new Map<Key, number>();

  frequencyBuckets = {} as Record<number, FrequencyBucket<Key, Value>>;

  #keyNodeMap = new Map<Key, Node<Key, Value>>();

  #INITIAL_FREQUENCY_VALUE = 0;

  #INITIAL_MIN_FREQUENCY_VALUE = 1;

  #currentMinFrequency = this.#INITIAL_MIN_FREQUENCY_VALUE;

  get size() {
    return this.#keyNodeMap.size;
  }

  hasItem(key: Key) {
    return this.#keyNodeMap.has(key);
  }

  getItem(key: Key) {
    return this.#keyNodeMap.get(key);
  }

  addItem(key: Key, value: Value) {
    this.#increaseFrequency(key);
    this.#resetMinFrequencyIfNeeded(key);

    const frequency = this.#keyFrequencyMap.get(key)!;
    const bucket = this.#getOrCreateBucket(frequency);

    bucket.append({ key, value });
    this.frequencyBuckets[frequency] = bucket;

    const newNode = bucket.tail!;
    this.#keyNodeMap.set(key, newNode);
    this.#keyFrequencyMap.set(key, frequency);
  }

  #increaseFrequency(key: Key) {
    const frequency =
      this.#keyFrequencyMap.get(key) ?? this.#INITIAL_FREQUENCY_VALUE;

    this.#keyFrequencyMap.set(key, frequency + 1);
  }

  #resetMinFrequencyIfNeeded(key: Key) {
    const frequency = this.#keyFrequencyMap.get(key);

    if (frequency === this.#INITIAL_MIN_FREQUENCY_VALUE) {
      this.#currentMinFrequency = frequency;
    }
  }

  #getOrCreateBucket(frequency: number) {
    return this.frequencyBuckets[frequency] ?? new DoublyLinkedList();
  }

  deleteItem(key: Key) {
    const node = this.#keyNodeMap.get(key)!;
    const frequency = this.#keyFrequencyMap.get(key)!;
    const bucket = this.frequencyBuckets[frequency];

    bucket.deleteByRef(node);
    this.#keyNodeMap.delete(key);

    if (bucket.isEmpty) {
      delete this.frequencyBuckets[frequency];

      this.#increaseMinFrequencyIfBucketIsEmpty(frequency);
    }
  }

  #increaseMinFrequencyIfBucketIsEmpty(frequency: number) {
    if (frequency === this.#currentMinFrequency) {
      this.#currentMinFrequency += 1;
    }
  }

  evictLeastFrequent() {
    const minFreq = this.#currentMinFrequency;
    const bucket = this.frequencyBuckets[minFreq];

    const leastFrequentNode = bucket.deleteHead()!;
    const { key } = leastFrequentNode.data;

    this.#keyNodeMap.delete(key);
    this.#keyFrequencyMap.delete(key);
  }

  clear() {
    this.#keyFrequencyMap.clear();
    this.frequencyBuckets = {};
    this.#keyNodeMap.clear();
    this.#currentMinFrequency = this.#INITIAL_MIN_FREQUENCY_VALUE;
  }
}
