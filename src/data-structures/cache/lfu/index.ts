import { DoublyLinkedList } from '@/data-structures/linked-lists/doubly-linked-list';
import { DoublyLinkedListNode } from '@/data-structures/linked-lists/doubly-linked-list/node';
import type { Payload } from '../types';

export class LFUCache<Key, Value> {
  #capacity: number;

  #keyFrequencyMap = new Map<Key, number>();

  #buckets = new Map<number, DoublyLinkedList<Payload<Key, Value>>>();

  #keyNodeMap = new Map<Key, DoublyLinkedListNode<Payload<Key, Value>>>();

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

  put(key: Key, value: Value) {
    if (this.#keyNodeMap.has(key)) {
      this.#deleteItemByKey(key);
    }

    if (this.#size === this.#capacity) {
      this.#evictLastFrequentlyUsedItem();
    }

    this.#addItem(key, value);

    // console.log('minFrequency', this.#minFrequency);
    // console.log('keyFreqMap', this.#keyFrequencyMap);
    // console.log('buckets', this.#buckets);

    return this;
  }

  #deleteItemByKey(key: Key) {
    this.#deleteNodeByKey(key);
    this.#updateFrequencyByKey(key);
    this.#updateMinFrequencyByKey(key);
    this.#size -= 1;
  }

  #deleteNodeByKey(key: Key) {
    const keyNodeMap = this.#keyNodeMap;

    const frequency = this.#keyFrequencyMap.get(key)!;
    const nodeList = this.#buckets.get(frequency)!;
    nodeList?.deleteByRef(keyNodeMap.get(key)!);

    if (nodeList?.isEmpty) {
      this.#buckets.delete(frequency);
    }

    keyNodeMap.delete(key);
  }

  #updateFrequencyByKey(key: Key) {
    const prevFrequency = this.#keyFrequencyMap.get(key)!;
    this.#keyFrequencyMap.set(key, prevFrequency + 1);
  }

  #updateMinFrequencyByKey(key: Key) {
    this.#minFrequency = this.#keyFrequencyMap.get(key)!;
  }

  #evictLastFrequentlyUsedItem() {
    this.#size -= 1;
  }

  #addItem(key: Key, value: Value) {
    let frequency = this.#getFrequencyByKey(key);
    this.#keyFrequencyMap.set(key, frequency);

    const nodesList = this.#getNodeListByFrequency(frequency);

    nodesList.append({ key, value });
    this.#buckets.set(frequency, nodesList);

    const newNode = nodesList.tail!;
    this.#keyNodeMap.set(key, newNode);

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
