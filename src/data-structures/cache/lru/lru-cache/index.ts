/* eslint-disable max-classes-per-file */
import type { ICache, Payload } from '@/data-structures/cache/types';
import {
  DoublyLinkedList,
  DoublyLinkedListNode,
} from '@/data-structures/linked-lists/doubly-linked-list';

export class LRUCache<Key extends keyof any, Value>
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

  get isEmpty() {
    return this.#storage.size === 0;
  }

  toArray<T>(
    callbackfn: (item: Payload<Key, Value>) => T = (item) =>
      item.value as unknown as T,
  ): T[] {
    return Array.from(this.#storage.store, (node) => node.data).map(callbackfn);
  }

  put(key: Key, value: Value): this {
    if (this.#storage.hasItem(key)) {
      this.#storage.deleteItem(key);
    }

    if (this.#storage.size === this.#capacity) {
      this.#storage.evictLeastRecentItem();
    }

    this.#storage.setItem(key, value);

    return this;
  }

  get(key: Key) {
    if (!this.#storage.hasItem(key)) return null;

    const node = this.#storage.getItem(key)!;
    this.#storage.deleteItem(key);
    this.#storage.setItem(key, node.data.value);

    return node.data.value;
  }

  clear() {
    this.#storage.clear();
  }

  // eslint-disable-next-line class-methods-use-this
  get [Symbol.toStringTag]() {
    return `${this.constructor.name}`;
  }
}

class Storage<Key extends keyof any, Value = any> {
  #nodeList = new DoublyLinkedList<Payload<Key, Value>>();

  #keyNodeMap = new Map<Key, DoublyLinkedListNode<Payload<Key, Value>>>();

  get store() {
    return this.#nodeList;
  }

  get size() {
    return this.#keyNodeMap.size;
  }

  hasItem(key: Key) {
    return this.#keyNodeMap.has(key);
  }

  getItem(key: Key) {
    return this.#keyNodeMap.get(key);
  }

  setItem(key: Key, value: Value) {
    this.#nodeList.append({ key, value });

    const newNode = this.#nodeList.tail!;
    this.#keyNodeMap.set(key, newNode);
  }

  deleteItem(key: Key) {
    const node = this.#keyNodeMap.get(key)!;
    this.#nodeList.deleteByRef(node);
  }

  evictLeastRecentItem() {
    const leastRecentNode = this.#nodeList.head!;

    this.#keyNodeMap.delete(leastRecentNode.data.key);
    this.#nodeList.deleteByRef(leastRecentNode);
  }

  clear() {
    this.#nodeList.clear();
    this.#keyNodeMap.clear();
  }
}
