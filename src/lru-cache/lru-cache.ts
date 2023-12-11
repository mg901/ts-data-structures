import { DoublyLinkedList } from './doubly-linked-list/doubly-linked-list';
import { Node } from './doubly-linked-list/node';

export class LRUCache<Key extends string | number | symbol = any, Value = any> {
  #cache = {} as Record<Key, Node<Key, Value>>;

  #orderedList = new DoublyLinkedList<Key, Value>();

  #capacity: number;

  constructor(public capacity: number) {
    this.#capacity = capacity;
  }

  get(key: Key) {
    if (!Object.hasOwn(this.#cache, key)) return -1;

    const node = this.#cache[key]!;
    this.#orderedList.delete(node);
    this.#cache[key] = this.#orderedList.push(key, node.value);

    return node.value;
  }

  put(key: Key, value: Value): void {
    if (Object.hasOwn(this.#cache, key)) {
      const node = this.#cache[key];
      this.#orderedList.delete(node!);
    }

    if (this.#orderedList.length === this.#capacity) {
      const head = this.#orderedList.head!;
      delete this.#cache[head.key];
      this.#orderedList.delete(head);
    }

    this.#cache[key] = this.#orderedList.push(key, value);
  }
}
