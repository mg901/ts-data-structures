import { DoublyLinkedList } from '../linked-lists/doubly-linked-list';
import { DoublyLinkedListNode } from '../linked-lists/doubly-linked-list/node';

type Payload<Key, Value> = {
  key: Key;
  value: Value;
};

export class MFUCache<Key extends string | number | symbol, Value> {
  #capacity: number;

  #nodeMap = new Map() as Map<Key, DoublyLinkedListNode<Payload<Key, Value>>>;

  #frequencyMap = new Map() as Map<Key, number>;

  #buckets = new Map() as Map<
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

  get(key: Key): Value | null {
    const nodeMap = this.#nodeMap;
    const freqMap = this.#frequencyMap;

    if (!nodeMap.get(key)) return null;

    const oldFreq = freqMap.get(key)!;

    this.#deleteFromBucket(key, oldFreq);
    this.#updateFrequency(key, oldFreq);

    const currentFreq = freqMap.get(key)!;
    this.#updateMaxFrequency(currentFreq);

    const node = nodeMap.get(key)!;
    this.#addToBucket(key, node.data.value, currentFreq);

    return node.data.value as Value;
  }

  put(key: Key, value: Value): this {
    const freqMap = this.#frequencyMap;

    // Overwrite the value by the key
    if (this.#nodeMap.has(key)) {
      const oldFreq = freqMap.get(key)!;

      this.#deleteFromBucket(key, oldFreq);
      this.#size -= 1;

      this.#updateFrequency(key, oldFreq);
    }

    if (this.#size === this.#capacity) {
      this.#evictLeastFrequent();
    }

    // Add item
    const INITIAL_FREQUENCY = 1;
    freqMap.set(key, freqMap.get(key) ?? INITIAL_FREQUENCY);

    const currentFreq = freqMap.get(key)!;
    this.#addToBucket(key, value, currentFreq);

    this.#size += 1;

    return this;
  }

  #addToBucket(key: Key, value: Value, freq: number): void {
    // Get or update DLL
    const dll =
      this.#buckets.get(freq) ?? new DoublyLinkedList<Payload<Key, Value>>();

    // Add Item to DLL
    dll.append({ key, value });

    // Update DLL
    this.#buckets.set(freq, dll);

    // Update reference
    this.#nodeMap.set(key, dll.tail!);
  }

  #deleteFromBucket(key: Key, oldFreq: number) {
    const bucket = this.#buckets.get(oldFreq);
    const node = this.#nodeMap.get(key)!;

    bucket?.deleteByRef(node);

    if (this.#buckets.get(oldFreq)?.isEmpty) this.#buckets.delete(oldFreq);
  }

  #updateFrequency(key: Key, oldFreq: number) {
    this.#frequencyMap.set(key, oldFreq + 1);
  }

  #evictLeastFrequent() {
    // Get the most frequently bucket
    const bucket = this.#buckets.get(this.#maxFrequency);

    // Delete item
    const deletedNode = bucket?.deleteTail()!;

    if (bucket?.isEmpty) this.#buckets.delete(this.#maxFrequency);

    // Remove mfu frequency
    this.#frequencyMap.delete(deletedNode.data.key);

    // Remove reverence to the mfu item;
    this.#nodeMap.delete(deletedNode.data.key);

    // Decrease max frequency
    this.#maxFrequency -= 1;
    this.#size -= 1;
  }

  #updateMaxFrequency(freq: number) {
    this.#maxFrequency = Math.max(this.#maxFrequency, freq);
  }
}
