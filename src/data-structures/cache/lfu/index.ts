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
    }

    if (this.#size === this.#capacity) {
      this.#evictLastFrequentlyUsed();
    }

    this.#addItem(key, value);

    return this;
  }

  #updateItemByKey(key: Key) {
    const frequency = this.#getFrequencyByKey(key);
    this.#deleteNodeInList(key, frequency);
    this.#deleteRefByKey(key);
    this.#updateFrequencyByKey(key);
    this.#updateMinFrequencyByKey(key);
    this.#size -= 1;
  }

  #deleteNodeInList(key: Key, frequency: number) {
    const nodeList = this.#getNodeListByFrequency(frequency);
    nodeList.deleteByRef(this.#keyRefMap.get(key)!);

    if (nodeList.isEmpty) {
      this.#buckets.delete(frequency);
    }
  }

  #deleteRefByKey(key: Key) {
    this.#keyRefMap.delete(key);
  }

  #updateFrequencyByKey(key: Key) {
    const prevFrequency = this.#getFrequencyByKey(key);
    this.#keyFrequencyMap.set(key, prevFrequency + 1);
  }

  #updateMinFrequencyByKey(key: Key) {
    this.#minFrequency = this.#getFrequencyByKey(key);
  }

  #evictLastFrequentlyUsed() {
    const minFreq = this.#minFrequency;
    const nodeList = this.#getNodeListByFrequency(minFreq);
    const deletedNode = nodeList.deleteHead();

    if (nodeList.isEmpty) {
      this.#buckets.delete(minFreq);
    }

    this.#deleteRefByKey(deletedNode?.data.key!);
    this.#keyFrequencyMap.delete(deletedNode?.data.key!);
    this.#size -= 1;
  }

  #addItem(key: Key, value: Value) {
    let frequency = this.#getFrequencyByKey(key);
    this.#keyFrequencyMap.set(key, frequency);

    const nodesList = this.#getNodeListByFrequency(frequency);

    nodesList.append({ key, value });
    this.#buckets.set(frequency, nodesList);

    const newNode = nodesList.tail!;
    this.#keyRefMap.set(key, newNode);

    this.#size += 1;
  }

  #getFrequencyByKey(key: Key) {
    const INITIAL_FREQUENCY = 1;

    return this.#keyFrequencyMap.get(key) ?? INITIAL_FREQUENCY;
  }

  #getNodeListByFrequency(freq: number) {
    return this.#buckets.get(freq) ?? new DoublyLinkedList();
  }
}
