import { HashTable } from '@/data-structures/hash-table';
import { DoublyLinkedList } from '@/data-structures/linked-lists/doubly-linked-list';
import { DoublyLinkedListNode } from '@/data-structures/linked-lists/doubly-linked-list/node';

type Payload<Key, Val> = {
  key: Key;
  value: Val;
};

export class LRUCache<Key extends string | number | symbol, Val> {
  #capacity: number;

  #cache = new DoublyLinkedList();

  #nodeMap = new HashTable<Key, DoublyLinkedListNode<Payload<Key, Val>>>();

  constructor(capacity: number) {
    this.#capacity = capacity;
  }

  get size() {
    return this.#cache.size;
  }

  get(key: Key) {
    if (!this.#nodeMap.has(key)) return -1;

    const node = this.#nodeMap.get(key);
    this.#cache.deleteByReference(node);

    const newNode = this.#cache.append({
      key,
      value: node.data.value,
    }).tail!;

    this.#nodeMap.set(key, newNode);

    return node.data.value;
  }

  put(key: Key, value: Val) {
    if (this.#nodeMap.has(key)) {
      const node = this.#nodeMap.get(key);
      this.#cache.deleteByReference(node!);
    }

    if (this.#cache.size === this.#capacity) {
      const head = this.#cache.head as DoublyLinkedListNode<Payload<Key, Val>>;

      this.#nodeMap.delete(head.data.key);
      this.#cache.deleteByReference(head);
    }

    this.#nodeMap.set(key, this.#cache.append({ key, value }).tail!);
  }

  // eslint-disable-next-line class-methods-use-this
  get [Symbol.toStringTag]() {
    return 'LRUCache';
  }
}
