import { DoublyLinkedList } from '@/data-structures/linked-lists/doubly-linked-list';
import { DoublyLinkedListNode } from '@/data-structures/linked-lists/doubly-linked-list/node';
import type { Payload } from '../types';

type KeyType = string | number | symbol;

export class LFUCache<Key extends KeyType, Value> {
  #keyFrequencyMap = {} as Record<Key, number>;

  #buckets = {} as Record<number, DoublyLinkedList<Payload<Key, Value>>>;

  #keyNodeMap = {} as Record<Key, DoublyLinkedListNode<Payload<Key, Value>>>;

  #capacity: number;

  #size = 0;

  constructor(capacity: number) {
    this.#capacity = capacity;
  }

  get size() {
    return this.#size;
  }

  put(key: Key, value: Value) {
    if (this.#size === this.#capacity) {
      this.#size -= 1;
    }

    this.#addItem(key, value);

    return this;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  #addItem(key: Key, value: Value) {
    this.#size += 1;
  }
}
