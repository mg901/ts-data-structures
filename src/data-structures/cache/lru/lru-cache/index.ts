import type { ICache } from '@/data-structures/cache/types';
import {
  DoublyLinkedList,
  DoublyLinkedListNode,
} from '@/data-structures/linked-lists/doubly-linked-list';

export class LRUCache<Key extends keyof any, Value>
  implements ICache<Key, Value>
{
  #capacity: number;

  #storage = createStorage<Key, Value>();

  constructor(capacity: number) {
    this.#capacity = capacity;
  }

  get size() {
    return this.#storage.size;
  }

  get isEmpty() {
    return this.#storage.size === 0;
  }

  toArray(): Value[] {
    return Array.from(this.#storage.linkedList, ({ data }) => data.value);
  }

  put(key: Key, value: Value): this {
    const { hasItem, deleteItem, size, evictLeastRecentItem, addItem } =
      this.#storage;

    if (hasItem(key)) {
      deleteItem(key);
    }

    if (size === this.#capacity) {
      evictLeastRecentItem();
    }

    addItem(key, value);

    return this;
  }

  get(key: Key) {
    const { hasItem, getItem, deleteItem, addItem } = this.#storage;

    if (!hasItem(key)) return null;

    const node = getItem(key)!;
    deleteItem(key);
    addItem(key, node.data.value);

    return node.data.value;
  }

  clear() {
    this.#storage.clear();
  }

  // eslint-disable-next-line class-methods-use-this
  get [Symbol.toStringTag]() {
    return 'LRUCache';
  }
}

function createStorage<Key extends keyof any, Value = any>() {
  const linkedList = new DoublyLinkedList<{ key: Key; value: Value }>();
  const keyNodeMap = new Map<
    Key,
    DoublyLinkedListNode<{ key: Key; value: Value }>
  >();

  return {
    linkedList,
    get size() {
      return keyNodeMap.size;
    },

    hasItem(key: Key) {
      return keyNodeMap.has(key);
    },

    getItem(key: Key) {
      return keyNodeMap.get(key);
    },
    addItem(key: Key, value: Value) {
      linkedList.append({ key, value });

      const newNode = linkedList.tail!;
      keyNodeMap.set(key, newNode);
    },

    deleteItem(key: Key) {
      const node = keyNodeMap.get(key)!;
      linkedList.deleteByRef(node);
    },
    evictLeastRecentItem() {
      const leastRecentNode = linkedList.head!;

      keyNodeMap.delete(leastRecentNode.data.key);
      linkedList.deleteByRef(leastRecentNode);
    },
    clear() {
      linkedList.clear();
      keyNodeMap.clear();
    },
  };
}
