import { DoublyLinkedList } from '../../linked-lists/doubly-linked-list';
import { DoublyLinkedListNode } from '../../linked-lists/doubly-linked-list/node';

interface IMFUCache<Key, Value> {
  get size(): number;
  toArray(): Value[];
  get(key: Key): Value | null;
  put(key: Key, value: Value): this;
  clear(): void;
}

type Payload<Key, Value> = {
  key: Key;
  value: Value;
};

export class MFUCache<Key extends string | number | symbol, Value>
  implements IMFUCache<Key, Value>
{
  #capacity: number;

  #keyNodeMap = {} as Record<Key, DoublyLinkedListNode<Payload<Key, Value>>>;

  #keyFrequencyMap = {} as Record<Key, number>;

  #buckets = {} as Record<
    number,
    DoublyLinkedList<Payload<Key, Value>> | undefined
  >;

  #maxFrequency = 1;

  #size = 0;

  constructor(capacity: number) {
    this.#capacity = capacity;
  }

  get size(): number {
    return this.#size;
  }

  toArray(): Value[] {
    return Object.values(this.#buckets).flatMap((list) =>
      list!.toArray().map((node) => node.value),
    );
  }

  put(key: Key, value: Value): this {
    // Overwrite the value by the key
    if (this.#keyNodeMap[key]) {
      const oldFreq = this.#keyFrequencyMap[key];

      this.#deleteItemByKey(key, oldFreq);
      this.#updateFrequencyByKey(key, oldFreq);
    }

    if (this.#size === this.#capacity) {
      this.#evictMostFrequentlyUsedItem();
    }

    this.#addItem(key, value);

    return this;
  }

  #deleteItemByKey(key: Key, freq: number) {
    this.#deleteFromBuckets(key, freq);
    this.#size -= 1;
  }

  #deleteFromBuckets(key: Key, oldFreq: number): void {
    const bucket = this.#buckets[oldFreq];
    const node = this.#keyNodeMap[key];

    bucket?.deleteByRef(node);

    if (this.#buckets[oldFreq]?.isEmpty) {
      delete this.#buckets[oldFreq];
    }
  }

  #updateFrequencyByKey(key: Key, oldFreq: number): void {
    this.#keyFrequencyMap[key] = oldFreq + 1;
  }

  #evictMostFrequentlyUsedItem(): void {
    // Get the most frequently bucket
    const bucket = this.#buckets[this.#maxFrequency];

    // Delete item
    const deletedNode = bucket?.deleteTail()!;

    if (bucket?.isEmpty) {
      delete this.#buckets[this.#maxFrequency];
    }

    // Remove least frequent key
    delete this.#keyFrequencyMap[deletedNode.data.key];

    // Remove reverence to the mfu item;
    delete this.#keyNodeMap[deletedNode.data.key];

    // Decrease max frequency
    this.#maxFrequency -= 1;
    this.#size -= 1;
  }

  #addItem(key: Key, value: Value) {
    const freqMap = this.#keyFrequencyMap;
    // Add item
    const INITIAL_FREQUENCY = 1;
    freqMap[key] = freqMap[key] ?? INITIAL_FREQUENCY;

    const currentFreq = freqMap[key];
    this.#addToBuckets(key, value, currentFreq);

    this.#size += 1;
  }

  get(key: Key): Value | null {
    const node = this.#keyNodeMap[key];

    if (!node) return null;

    this.#updateAccessOrderByKey(key);

    return node.data.value as Value;
  }

  #updateAccessOrderByKey(key: Key) {
    const freqMap = this.#keyFrequencyMap;
    const oldFreq = freqMap[key];

    this.#deleteFromBuckets(key, oldFreq);
    this.#updateFrequencyByKey(key, oldFreq);

    const currentFreq = freqMap[key];
    this.#updateMaxFrequency(currentFreq);

    const node = this.#keyNodeMap[key];
    this.#addToBuckets(key, node.data.value, currentFreq);
  }

  #updateMaxFrequency(freq: number): void {
    this.#maxFrequency = Math.max(this.#maxFrequency, freq);
  }

  #addToBuckets(key: Key, value: Value, freq: number): void {
    // Get or update DLL
    const dll =
      this.#buckets[freq] ?? new DoublyLinkedList<Payload<Key, Value>>();

    // Add Item to DLL
    dll.append({ key, value });

    // Update DLL
    this.#buckets[freq] = dll;

    // Update reference
    this.#keyNodeMap[key] = dll.tail!;
  }

  clear() {
    // @ts-ignore
    this.#keyNodeMap = {};
    // @ts-ignore
    this.#keyFrequencyMap = {};
    this.#buckets = {};
    this.#maxFrequency = 1;
    this.#size = 0;
  }

  // eslint-disable-next-line class-methods-use-this
  get [Symbol.toStringTag]() {
    return 'MFUCache';
  }
}
