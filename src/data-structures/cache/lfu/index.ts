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

  toArray<T>(
    callbackfn: (item: Payload<Key, Value>) => T = (item) =>
      item.value as unknown as T,
  ): T[] {
    return Object.values(this.#storage.store)
      .flatMap((list) => list?.toArray())
      .map(callbackfn);
  }

  get isEmpty() {
    return this.toArray().length === 0;
  }

  put(key: Key, value: Value) {
    const storage = this.#storage;

    if (storage.hasItem(key)) {
      storage.removeItem(key);
    }

    if (storage.size === this.#capacity) {
      storage.evictLeastFrequentItem();
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

  // eslint-disable-next-line class-methods-use-this
  get [Symbol.toStringTag]() {
    return 'LFUCache';
  }
}

class Storage<Key extends keyof any, Value> {
  #keyFrequencyMap = new Map<Key, number>();

  #frequencyBuckets = {} as Record<
    number,
    DoublyLinkedList<Payload<Key, Value>>
  >;

  #keyNodeMap = new Map<Key, DoublyLinkedListNode<Payload<Key, Value>>>();

  #INITIAL_MIN_FREQUENCY_VALUE = 1;

  #currentMinFrequency = this.#INITIAL_MIN_FREQUENCY_VALUE;

  get size() {
    return this.#keyNodeMap.size;
  }

  get store() {
    return this.#frequencyBuckets;
  }

  getItem(key: Key) {
    return this.#keyNodeMap.get(key);
  }

  setItem(key: Key, value: Value) {
    this.#increaseFrequency(key);
    this.#resetMinFrequencyIfNeeded(key);

    const frequency = this.#keyFrequencyMap.get(key)!;
    const bucket = this.#getOrCreateBucket(frequency);

    bucket.append({ key, value });
    this.#frequencyBuckets[frequency] = bucket;

    const newNode = bucket.tail!;
    this.#keyNodeMap.set(key, newNode);
    this.#keyFrequencyMap.set(key, frequency);
  }

  #increaseFrequency(key: Key) {
    const INITIAL_FREQUENCY_VALUE = 0;
    const frequency = this.#keyFrequencyMap.get(key) ?? INITIAL_FREQUENCY_VALUE;

    this.#keyFrequencyMap.set(key, frequency + 1);
  }

  #resetMinFrequencyIfNeeded(key: Key) {
    const frequency = this.#keyFrequencyMap.get(key);

    if (frequency === this.#INITIAL_MIN_FREQUENCY_VALUE) {
      this.#currentMinFrequency = frequency;
    }
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

  evictLeastFrequentItem() {
    const minFreq = this.#currentMinFrequency;
    const bucket = this.#frequencyBuckets[minFreq];

    const leastFrequentNode = bucket.removeHead()!;

    const { key } = leastFrequentNode.data;
    this.#keyNodeMap.delete(key);
    this.#keyFrequencyMap.delete(key);
  }

  clear() {
    this.#frequencyBuckets = {};
    this.#keyNodeMap.clear();
    this.#keyFrequencyMap.clear();
    this.#currentMinFrequency = this.#INITIAL_MIN_FREQUENCY_VALUE;
  }
}
