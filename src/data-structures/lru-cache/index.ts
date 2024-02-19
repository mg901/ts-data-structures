import { DoublyLinkedListNode } from '@/data-structures/linked-lists/doubly-linked-list/node';

type NodeValue<K = any, V = any> = {
  key: K;
  value: V;
};

export class LRUCache<Key extends string | number | symbol = any, Value = any> {
  #nodeMap = {} as Record<Key, DoublyLinkedListNode<NodeValue<Key, Value>>>;

  #capacity: number;

  #head: DoublyLinkedListNode | null = null;

  #tail: DoublyLinkedListNode | null = null;

  #size: number = 0;

  constructor(capacity: number) {
    this.#capacity = capacity;
  }

  // eslint-disable-next-line class-methods-use-this
  get [Symbol.toStringTag]() {
    return 'LRUCache';
  }

  #push<K = any, V = any>(key: K, value: V) {
    const newNode = new DoublyLinkedListNode({
      key,
      value,
    });

    if (this.#head === null) {
      this.#head = newNode;
      this.#tail = newNode;
    } else {
      this.#tail!.next = newNode;
      newNode.prev = this.#tail;
      this.#tail = newNode;
    }

    this.#size += 1;

    return newNode;
  }

  #deleteByReference(node: DoublyLinkedListNode) {
    if (this.#head === this.#tail) {
      this.#head = null;
      this.#tail = null;
    } else if (node === this.#head && this.#head?.next) {
      this.#head = this.#head.next;
      this.#head.prev = null;
    } else if (node === this.#tail && this.#tail.prev) {
      this.#tail = this.#tail.prev;
      this.#tail.next = null;
    } else {
      node.prev!.next = node.next;
      node.next!.prev = node.prev;
    }

    this.#size -= 1;
  }

  get(key: Key) {
    if (!Object.hasOwn(this.#nodeMap, key)) return -1;

    const node = this.#nodeMap[key];
    this.#deleteByReference(node);
    this.#nodeMap[key] = this.#push(key, node.data.value);

    return node.data.value;
  }

  put(key: Key, value: Value) {
    if (Object.hasOwn(this.#nodeMap, key)) {
      const node = this.#nodeMap[key];
      this.#deleteByReference(node!);
    }

    if (this.#size === this.#capacity) {
      const head = this.#head as DoublyLinkedListNode<NodeValue<Key, Value>>;

      delete this.#nodeMap[head.data.key];
      this.#deleteByReference(head);
    }

    this.#nodeMap[key] = this.#push(key, value);
  }
}
