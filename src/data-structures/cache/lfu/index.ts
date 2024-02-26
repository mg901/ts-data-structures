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
}
