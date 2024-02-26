import { DoublyLinkedList } from '@/data-structures/linked-lists/doubly-linked-list';
import { DoublyLinkedListNode } from '@/data-structures/linked-lists/doubly-linked-list/node';
import type { Payload } from '../types';

export class LFUCache<Key, Value> {
  #capacity: number;

  #keyFrequencyMap = new Map<Key, number>();

  #buckets = new Map<number, DoublyLinkedList<Payload<Key, Value>>>();

  #keyRefMap = new Map<Key, DoublyLinkedListNode<Payload<Key, Value>>>();

  #minFrequency = 1;

  #size = 0;

  constructor(capacity: number) {
    this.#capacity = capacity;
  }

  get size() {
    return this.#size;
  }

  toArray(): Value[] {
    const lists = this.#buckets.values();

    return Array.from(lists)
      .flatMap((list) => list?.toArray())
      .map((pair) => pair.value);
  }

  get isEmpty() {
    return this.toArray().length === 0;
  }

  put(key: Key, value: Value) {
    if (this.#keyRefMap.has(key)) {
      this.#updateItemByKey(key);
      this.#size -= 1;
    }

    if (this.#size === this.#capacity) {
      this.#evictLastFrequentlyUsed();
    }

    this.#addItem(key, value);

    return this;
  }

  #updateItemByKey(key: Key) {
    const frequency = this.#getFrequencyByKey(key);
    this.#deleteNodeByRef(key, frequency);
    this.#deleteRefByKey(key);
    this.#setFrequencyByKey(key, frequency + 1);
    this.#updateMinFrequencyByKey(key);
  }

  #deleteNodeByRef(key: Key, frequency: number) {
    const nodeList = this.#getNodeListByFrequency(frequency);
    const ref = this.#keyRefMap.get(key)!;
    nodeList.deleteByRef(ref);

    this.#deleteIfBucketIsEmpty(nodeList, frequency);
  }

  #updateMinFrequencyByKey(key: Key) {
    const newFreq = this.#getFrequencyByKey(key);
    this.#minFrequency = Math.min(this.#minFrequency, newFreq);
  }

  #evictLastFrequentlyUsed() {
    const minFreq = this.#minFrequency;
    const list = this.#getNodeListByFrequency(minFreq);
    const deletedNode = list.deleteHead();
    const { key } = deletedNode!.data;

    this.#deleteIfBucketIsEmpty(list, minFreq);
    this.#deleteRefByKey(key);
    this.#deleteFrequencyByKey(key);
    this.#size -= 1;
  }

  #deleteIfBucketIsEmpty(
    nodeList: DoublyLinkedList<Payload<Key, Value>>,
    frequency: number,
  ) {
    if (nodeList.isEmpty) {
      this.#buckets.delete(frequency);
    }
  }

  #deleteRefByKey(key: Key) {
    this.#keyRefMap.delete(key);
  }

  #deleteFrequencyByKey(key: Key) {
    this.#keyFrequencyMap.delete(key);
  }

  #addItem(key: Key, value: Value) {
    const frequency = this.#getFrequencyByKey(key);
    this.#setFrequencyByKey(key, frequency);
    const nodesList = this.#getNodeListByFrequency(frequency);

    nodesList.append({ key, value });
    this.#buckets.set(frequency, nodesList);

    const newRef = nodesList.tail!;
    this.#keyRefMap.set(key, newRef);

    this.#size += 1;
  }

  #setFrequencyByKey(key: Key, frequency: number) {
    this.#keyFrequencyMap.set(key, frequency);
  }

  #getFrequencyByKey(key: Key) {
    const INITIAL_FREQUENCY = 1;

    return this.#keyFrequencyMap.get(key) ?? INITIAL_FREQUENCY;
  }

  #getNodeListByFrequency(freq: number) {
    return this.#buckets.get(freq) ?? new DoublyLinkedList();
  }
}
