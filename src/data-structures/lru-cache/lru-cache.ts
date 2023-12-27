import { DoublyLinkedListNode as Node } from '@/data-structures/doubly-linked-list';

type NodeValue<K = any, V = any> = {
  key: K;
  value: V;
};

export class LRUCache<Key extends string | number | symbol = any, Value = any> {
  #nodeMap = {} as Record<Key, Node<NodeValue<Key, Value>>>;

  #capacity: number;

  #head: Node | null = null;

  #tail: Node | null = null;

  #size: number = 0;

  constructor(public capacity: number) {
    this.#capacity = capacity;
  }

  #push<K = any, V = any>(key: K, value: V) {
    const newNode = new Node({ key, value });

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

  #deleteByReference(node: Node): void {
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
    this.#nodeMap[key] = this.#push(key, node.value.value);

    return node.value.value;
  }

  put(key: Key, value: Value): void {
    if (Object.hasOwn(this.#nodeMap, key)) {
      const node = this.#nodeMap[key];
      this.#deleteByReference(node!);
    }

    if (this.#size === this.#capacity) {
      const head = this.#head as Node<NodeValue<Key, Value>>;

      delete this.#nodeMap[head.value.key];
      this.#deleteByReference(head);
    }

    this.#nodeMap[key] = this.#push(key, value);
  }
}
