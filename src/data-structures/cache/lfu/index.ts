import type { ICache, Payload } from '@/data-structures/cache/types';
import {
  DoublyLinkedList,
  DoublyLinkedListNode,
} from '@/data-structures/linked-lists/doubly-linked-list';

export class LFUCache<Key extends string | number | symbol, Value>
  implements ICache<Key, Value>
{
  #capacity: number;

  #keyFrequencyMap = new Map<Key, number>();

  #buckets = {} as Record<number, DoublyLinkedList<Payload<Key, Value>>>;

  #keyNodeMap = new Map<Key, DoublyLinkedListNode<Payload<Key, Value>>>();

  #INITIAL_FREQUENCY = 1;

  #minFrequency = this.#INITIAL_FREQUENCY;

  #size = 0;

  constructor(capacity: number) {
    this.#capacity = capacity;
  }

  get size() {
    return this.#size;
  }

  toArray() {
    return Object.values(this.#buckets)
      .flatMap((list) => list?.toArray())
      .map((pair) => pair.value);
  }

  get isEmpty() {
    return this.toArray().length === 0;
  }

  put(key: Key, value: Value) {
    if (this.#keyNodeMap.has(key)) {
      this.#removeItem(key);
    }

    if (this.#size === this.#capacity) {
      this.#evictLeastFrequentlyUsed();
    }

    this.#addItem(key, value);

    return this;
  }

  get(key: Key) {
    if (!this.#keyNodeMap.has(key)) return null;

    const node = this.#getNodeByKey(key)!;
    const { value } = node.data;
    this.#removeItem(key);
    this.#addItem(key, value);

    return node.data.value;
  }

  clear() {
    this.#keyFrequencyMap.clear();
    this.#buckets = {};
    this.#keyNodeMap.clear();
    this.#minFrequency = this.#INITIAL_FREQUENCY;
    this.#size = 0;
  }

  #removeItem(key: Key) {
    const node = this.#getNodeByKey(key)!;
    const freq = this.#safeGetFrequency(key);
    const nodeList = this.#safeGetNodeList(freq);

    nodeList.deleteByRef(node);
    this.#size -= 1;

    if (nodeList.isEmpty) {
      delete this.#buckets[freq];

      this.#increaseMinFrequencyIfNeeded(freq);
    }

    this.#keyFrequencyMap.set(key, freq + 1);
  }

  #increaseMinFrequencyIfNeeded(freq: number) {
    if (this.#minFrequency === freq) {
      this.#minFrequency += 1;
    }
  }

  #evictLeastFrequentlyUsed() {
    const minFreq = this.#minFrequency;
    const nodeList = this.#buckets[minFreq];

    const leastFrequentNode = nodeList.deleteHead()!;
    const { key } = leastFrequentNode.data;
    this.#keyNodeMap.delete(key);
    this.#keyFrequencyMap.delete(key);
    this.#size -= 1;
  }

  #addItem(key: Key, value: Value) {
    const freq = this.#safeGetFrequency(key);

    if (freq === this.#INITIAL_FREQUENCY) {
      this.#minFrequency = this.#INITIAL_FREQUENCY;
    }

    const nodeList = this.#safeGetNodeList(freq);
    nodeList.append({ key, value });
    this.#buckets[freq] = nodeList;
    this.#keyNodeMap.set(key, nodeList.tail!);
    this.#keyFrequencyMap.set(key, freq);
    this.#size += 1;
  }

  #getNodeByKey(key: Key) {
    return this.#keyNodeMap.get(key);
  }

  #safeGetFrequency(key: Key) {
    return this.#keyFrequencyMap.get(key) ?? this.#INITIAL_FREQUENCY;
  }

  #safeGetNodeList(freq: number) {
    return this.#buckets[freq] ?? new DoublyLinkedList();
  }

  // eslint-disable-next-line class-methods-use-this
  get [Symbol.toStringTag]() {
    return 'LFUCache';
  }
}
