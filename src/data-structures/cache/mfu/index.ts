/* eslint-disable max-classes-per-file */
import {
  DoublyLinkedList,
  DoublyLinkedListNode,
} from '@/data-structures/linked-lists/doubly-linked-list';
import type { ICache, Payload } from '../types';

export class MFUCache<Key extends keyof any, Value = any>
  implements ICache<Key, Value>
{
  #capacity: number;

  #storage = new Storage<Key, Value>();

  constructor(capacity: number) {
    this.#capacity = capacity;
  }

  get size(): number {
    return this.#storage.size;
  }

  get isEmpty() {
    return this.#storage.size === 0;
  }

  toArray<T>(
    callbackfn: (item: Payload<Key, Value>) => T = (item) =>
      item.value as unknown as T,
  ): T[] {
    const { store } = this.#storage;

    return Object.values(store)
      .flatMap((linkedList) => linkedList.toArray())
      .map(callbackfn);
  }

  put(key: Key, value: Value) {
    if (this.#storage.hasItem(key)) {
      this.#storage.removeItem(key);
    }

    if (this.#storage.size === this.#capacity) {
      this.#storage.evictTheMostFrequentItem();
    }

    this.#storage.setItem(key, value);

    return this;
  }

  get(key: Key) {
    if (!this.#storage.hasItem(key)) return null;

    const { value } = this.#storage.getItem(key)!.data;
    this.#storage.removeItem(key);
    this.#storage.setItem(key, value);

    return value;
  }

  clear() {
    this.#storage.clear();
  }

  // eslint-disable-next-line class-methods-use-this
  get [Symbol.toStringTag]() {
    return 'MFUCache';
  }
}

class Storage<Key extends keyof any, Value = any> {
  #frequencyNodes = new DoublyLinkedList<number>();

  #frequencyFrequencyNodeMap = new Map<number, DoublyLinkedListNode<number>>();

  #bucket = new DoublyLinkedList<Payload<Key, Value>>();

  #frequencyBucketMap = {} as Record<
    number,
    DoublyLinkedList<Payload<Key, Value>>
  >;

  #keyFrequencyMap = new Map<Key, number>();

  #keyNodeMap = new Map<Key, DoublyLinkedListNode<Payload<Key, Value>>>();

  #INITIAL_FREQUENCY_VALUE = 0;

  #maxFrequency = this.#INITIAL_FREQUENCY_VALUE;

  get store() {
    return this.#frequencyBucketMap;
  }

  get size() {
    return this.#keyNodeMap.size;
  }

  setItem(key: Key, value: Value) {
    this.#increaseFrequency(key);

    const currentFreq = this.#keyFrequencyMap.get(key)!;
    if (!this.#frequencyFrequencyNodeMap.has(currentFreq)) {
      this.#addFrequencyNode(currentFreq);

      this.#maxFrequency = this.#frequencyNodes.tail!.data;
    }

    this.#addNewNodeToBucket(key, value);
  }

  getItem(key: Key) {
    return this.#keyNodeMap.get(key);
  }

  #increaseFrequency(key: Key) {
    const frequency =
      this.#keyFrequencyMap.get(key) ?? this.#INITIAL_FREQUENCY_VALUE;

    this.#keyFrequencyMap.set(key, frequency + 1);
  }

  #addNewNodeToBucket(key: Key, value: Value) {
    const frequency = this.#keyFrequencyMap.get(key)!;
    const bucket = this.#getOrCreateNewBucket(frequency);

    bucket.append({ key, value });
    const newNode = bucket.tail!;

    this.#keyNodeMap.set(key, newNode);
    this.#frequencyBucketMap[frequency] = bucket;
  }

  #getOrCreateNewBucket(frequency: number) {
    return (
      this.#frequencyBucketMap[frequency] ??
      new DoublyLinkedList<Payload<Key, Value>>()
    );
  }

  #addFrequencyNode(frequency: number) {
    const frequencyNodes = this.#frequencyNodes;
    let newFrequencyNode: DoublyLinkedListNode<number>;

    if (frequency === 1) {
      frequencyNodes.prepend(frequency);
      newFrequencyNode = frequencyNodes.head!;
    } else {
      frequencyNodes.append(frequency);
      newFrequencyNode = frequencyNodes.tail!;
    }

    this.#frequencyFrequencyNodeMap.set(frequency, newFrequencyNode);
  }

  hasItem(key: Key) {
    return this.#keyNodeMap.has(key);
  }

  removeItem(key: Key) {
    const frequency = this.#keyFrequencyMap.get(key)!;
    const bucket = this.#frequencyBucketMap[frequency]!;
    const node = this.#keyNodeMap.get(key)!;

    bucket.deleteByRef(node);
    this.#keyNodeMap.delete(key);

    if (bucket.isEmpty) {
      const frequencyNode = this.#frequencyFrequencyNodeMap.get(frequency)!;

      this.#frequencyNodes.deleteByRef(frequencyNode);
      this.#frequencyFrequencyNodeMap.delete(frequency);
      delete this.#frequencyBucketMap[frequency];
    }
  }

  evictTheMostFrequentItem() {
    const maxFreq = this.#maxFrequency;
    const bucket = this.#frequencyBucketMap[maxFreq]!;
    const { key } = bucket.deleteTail()!.data;
    this.#keyNodeMap.delete(key);
    this.#keyFrequencyMap.delete(key);

    if (bucket.isEmpty) {
      this.#frequencyNodes.deleteTail();
      this.#frequencyFrequencyNodeMap.delete(maxFreq);
      delete this.#frequencyBucketMap[maxFreq];
    }
  }

  clear() {
    this.#frequencyNodes.clear();
    this.#frequencyFrequencyNodeMap.clear();
    this.#bucket.clear();
    this.#frequencyBucketMap = {};
    this.#keyFrequencyMap.clear();
    this.#keyNodeMap.clear();
    this.#maxFrequency = this.#INITIAL_FREQUENCY_VALUE;
  }
}
