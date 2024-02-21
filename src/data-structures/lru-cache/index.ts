import { DoublyLinkedList } from '@/data-structures/linked-lists/doubly-linked-list';
import { DoublyLinkedListNode } from '@/data-structures/linked-lists/doubly-linked-list/node';

type Payload<Key, Val> = {
  key: Key;
  value: Val;
};

export class LRUCache<Key extends string | number | symbol, Val> {
  #capacity: number;

  #storage = new DoublyLinkedList();

  #nodeMap = Object.create(null) as Record<
    Key,
    DoublyLinkedListNode<Payload<Key, Val>>
  >;

  constructor(capacity: number) {
    this.#capacity = capacity;
  }

  get size() {
    return this.#storage.size;
  }

  get(key: Key) {
    if (!this.#nodeMap[key]) return -1;

    const node = this.#nodeMap[key];
    this.#storage.deleteByReference(node);

    const newNode = this.#storage.append({
      key,
      value: node.data.value,
    }).tail!;

    this.#nodeMap[key] = newNode;

    return node.data.value;
  }

  put(key: Key, value: Val) {
    if (this.#nodeMap[key]) {
      const node = this.#nodeMap[key];
      this.#storage.deleteByReference(node!);
    }

    if (this.#storage.size === this.#capacity) {
      const head = this.#storage.head as DoublyLinkedListNode<
        Payload<Key, Val>
      >;

      delete this.#nodeMap[head.data.key];
      this.#storage.deleteByReference(head);
    }

    this.#nodeMap[key] = this.#storage.append({ key, value }).tail!;
  }

  // eslint-disable-next-line class-methods-use-this
  get [Symbol.toStringTag]() {
    return 'LRUCache';
  }
}
