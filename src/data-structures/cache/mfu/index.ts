/* eslint-disable max-classes-per-file */
import type { ICache, Payload } from '@/data-structures/cache/types';
import {
  DoublyLinkedList,
  DoublyLinkedListNode,
} from '@/data-structures/linked-lists/doubly-linked-list';

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

interface FrequencyNode extends DoublyLinkedListNode<number> {}
interface Bucket<Key, Value> extends DoublyLinkedList<Payload<Key, Value>> {}

class Storage<Key extends keyof any, Value = any> {
  #keyFrequencyMap = new Map<Key, number>();

  #frequencyFrequencyNodeMap = new Map<number, FrequencyNode>();

  #frequencyNodes = new DoublyLinkedList<number>();

  #frequencyBucketMap = {} as Record<number, Bucket<Key, Value>>;

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

    const frequency = this.#getFrequency(key)!;
    if (!this.#frequencyFrequencyNodeMap.has(frequency)) {
      this.#addNewFrequencyNode(frequency);

      this.#maxFrequency = this.#frequencyNodes.tail!.data;
    }

    this.#addNewNodeToBucket(key, value);
  }

  #increaseFrequency(key: Key) {
    const frequency = this.#getFrequency(key) ?? this.#INITIAL_FREQUENCY_VALUE;

    this.#keyFrequencyMap.set(key, frequency + 1);
  }

  #addNewNodeToBucket(key: Key, value: Value) {
    const frequency = this.#getFrequency(key)!;
    const bucket = this.#getOrCreateNewBucket(frequency);

    bucket.append({ key, value });
    const newNode = bucket.tail!;

    this.#keyNodeMap.set(key, newNode);
    this.#frequencyBucketMap[frequency] = bucket;
  }

  getItem(key: Key) {
    return this.#keyNodeMap.get(key);
  }

  #getOrCreateNewBucket(frequency: number) {
    return (
      this.#frequencyBucketMap[frequency] ??
      new DoublyLinkedList<Payload<Key, Value>>()
    );
  }

  #addNewFrequencyNode(frequency: number) {
    const newNode =
      frequency === 1
        ? this.#frequencyNodes.prepend(frequency).head!
        : this.#frequencyNodes.append(frequency).tail!;

    this.#frequencyFrequencyNodeMap.set(frequency, newNode);
  }

  hasItem(key: Key) {
    return this.#keyNodeMap.has(key);
  }

  removeItem(key: Key) {
    const frequency = this.#getFrequency(key)!;
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

  #getFrequency(key: Key) {
    return this.#keyFrequencyMap.get(key);
  }

  evictTheMostFrequentItem() {
    const maxFrequency = this.#maxFrequency;
    const bucket = this.#frequencyBucketMap[maxFrequency]!;

    const deletedNode = bucket.removeTail()!.data;

    this.#keyNodeMap.delete(deletedNode.key);
    this.#keyFrequencyMap.delete(deletedNode.key);

    if (bucket.isEmpty) {
      this.#frequencyNodes.removeTail();
      this.#frequencyFrequencyNodeMap.delete(maxFrequency);
      delete this.#frequencyBucketMap[maxFrequency];
    }
  }

  clear() {
    this.#keyFrequencyMap.clear();
    this.#frequencyFrequencyNodeMap.clear();
    this.#frequencyNodes.clear();
    this.#frequencyBucketMap = {};
    this.#keyNodeMap.clear();
    this.#maxFrequency = this.#INITIAL_FREQUENCY_VALUE;
  }
}
