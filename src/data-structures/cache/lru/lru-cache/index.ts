/* eslint-disable max-classes-per-file */
import { DoublyLinkedListNode } from '@/data-structures/linked-lists/doubly-linked-list';
import { Nullable } from '@/shared/types';

type Payload<K, V> = {
  key: Nullable<K>;
  value: Nullable<V>;
};

export class LRUCache<K, V> {
  #capacity;

  #keyNodeMap = new Map();

  #head = new DoublyLinkedListNode<Payload<K, V>>({
    key: null,
    value: null,
  });

  #tail = new DoublyLinkedListNode<Payload<K, V>>({
    key: null,
    value: null,
  });

  constructor(capacity: number) {
    this.#capacity = capacity;
    this.#head.next = this.#tail;
    this.#tail.prev = this.#head;
  }

  get size() {
    return this.#keyNodeMap.size;
  }

  get(key: K) {
    if (!this.#keyNodeMap.has(key)) return null;

    const node = this.#keyNodeMap.get(key);
    this.#delete(node);
    this.#prepend(node);

    return node.data.value;
  }

  put(key: K, val: V) {
    if (this.#keyNodeMap.has(key)) {
      const node = this.#keyNodeMap.get(key);
      this.#delete(node);

      node.data.value = val;
      this.#prepend(node);

      return;
    }

    if (this.#keyNodeMap.size === this.#capacity) {
      const victim = this.#tail.prev!;

      this.#delete(victim);
      this.#keyNodeMap.delete(victim.data.key);
    }

    const node = new DoublyLinkedListNode({ key, value: val });
    this.#keyNodeMap.set(key, node);
    this.#prepend(node);
  }

  #delete(node: DoublyLinkedListNode) {
    if (node.prev) node.prev.next = node.next;
    if (node.next) node.next.prev = node.prev;

    node.next = null;
    node.prev = null;
  }

  #prepend(node: DoublyLinkedListNode) {
    node.next = this.#head.next;
    node.prev = this.#head;

    if (this.#head.next) this.#head.next.prev = node;
    this.#head.next = node;
  }

  clear() {
    this.#head.next = this.#tail;
    this.#tail.prev = this.#head;
    this.#keyNodeMap.clear();
  }
}
