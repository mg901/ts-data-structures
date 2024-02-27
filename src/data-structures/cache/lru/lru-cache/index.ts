import {
  DoublyLinkedList,
  DoublyLinkedListNode,
} from '@/data-structures/linked-lists/doubly-linked-list';
import { ILRUCache } from '../types';

type Payload<Key, Val> = {
  key: Key;
  value: Val;
};

export class LRUCache<Key extends string | number | symbol, Value>
  implements ILRUCache<Key, Value>
{
  #capacity: number;

  #cache = new DoublyLinkedList<Payload<Key, Value>>();

  #keyNodeMap = {} as Record<Key, DoublyLinkedListNode<Payload<Key, Value>>>;

  constructor(capacity: number) {
    this.#capacity = capacity;
  }

  get size() {
    return this.#cache.size;
  }

  toArray(): Value[] {
    return Array.from(this.#cache, ({ data }) => data.value);
  }

  put(key: Key, value: Value): this {
    if (this.#keyNodeMap[key]) {
      this.#deleteItemByKey(key);
    }

    if (this.#cache.size === this.#capacity) {
      this.#evictLastRecentlyUsed();
    }

    this.#addItem(key, value);

    return this;
  }

  #deleteItemByKey(key: Key) {
    const node = this.#keyNodeMap[key];
    this.#cache.deleteByRef(node!);
  }

  #evictLastRecentlyUsed() {
    const head = this.#cache.head as DoublyLinkedListNode<Payload<Key, Value>>;

    delete this.#keyNodeMap[head.data.key];
    this.#cache.deleteByRef(head);
  }

  #addItem(key: Key, value: Value) {
    this.#keyNodeMap[key] = this.#cache.append({ key, value }).tail!;
  }

  get(key: Key) {
    const node = this.#keyNodeMap[key];

    if (!node) return null;

    this.#updateAccessOrderByKey(key);

    return node.data.value;
  }

  #updateAccessOrderByKey(key: Key) {
    const node = this.#keyNodeMap[key];
    const cache = this.#cache;

    cache.deleteByRef(node);
    cache.append({
      key,
      value: node.data.value,
    });

    this.#keyNodeMap[key] = cache.tail!;
  }

  // eslint-disable-next-line class-methods-use-this
  get [Symbol.toStringTag]() {
    return 'LRUCache';
  }
}
