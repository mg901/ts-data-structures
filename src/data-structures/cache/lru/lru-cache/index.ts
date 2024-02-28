import type { ICache, Payload } from '@/data-structures/cache/types';
import {
  DoublyLinkedList,
  DoublyLinkedListNode,
} from '@/data-structures/linked-lists/doubly-linked-list';

export class LRUCache<Key extends string | number | symbol, Value>
  implements ICache<Key, Value>
{
  #capacity: number;

  #cache = new DoublyLinkedList<Payload<Key, Value>>();

  #keyNodeMap = new Map<Key, DoublyLinkedListNode<Payload<Key, Value>>>();

  constructor(capacity: number) {
    this.#capacity = capacity;
  }

  get size() {
    return this.#cache.size;
  }

  get isEmpty(): boolean {
    return this.toArray().length === 0;
  }

  toArray(): Value[] {
    return Array.from(this.#cache, ({ data }) => data.value);
  }

  put(key: Key, value: Value): this {
    if (this.#keyNodeMap.has(key)) {
      this.#deleteItem(key);
    }

    if (this.#cache.size === this.#capacity) {
      this.#evictLeastRecentlyUsed();
    }

    this.#addItem(key, value);

    return this;
  }

  get(key: Key) {
    const node = this.#keyNodeMap.get(key);

    if (!node) return null;

    this.#cache.deleteByRef(node);
    this.#addItem(key, node.data.value);

    return node.data.value;
  }

  #deleteItem(key: Key) {
    const node = this.#keyNodeMap.get(key)!;
    this.#cache.deleteByRef(node);
  }

  #evictLeastRecentlyUsed() {
    const leastRecentlyUsed = this.#cache.head!;

    this.#keyNodeMap.delete(leastRecentlyUsed.data.key);
    this.#cache.deleteByRef(leastRecentlyUsed);
  }

  #addItem(key: Key, value: Value) {
    this.#cache.append({ key, value });

    const newNode = this.#cache.tail!;
    this.#keyNodeMap.set(key, newNode);
  }

  clear() {
    this.#cache = new DoublyLinkedList();
    // @ts-ignore
    this.#keyNodeMap = {};
  }

  // eslint-disable-next-line class-methods-use-this
  get [Symbol.toStringTag]() {
    return 'LRUCache';
  }
}
