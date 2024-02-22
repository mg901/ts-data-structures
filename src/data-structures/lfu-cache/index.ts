import { DoublyLinkedList } from '../linked-lists/doubly-linked-list';
import { DoublyLinkedListNode } from '../linked-lists/doubly-linked-list/node';

type Payload<K, V> = {
  key: K;
  value: V;
};

export class LFUCache<Key extends string | number | symbol, Value = any> {
  #capacity: number;

  buckets = {} as Record<
    number,
    DoublyLinkedList<Payload<Key, Value>> | undefined
  >;

  #nodeMap = {} as Record<Key, DoublyLinkedListNode<Payload<Key, Value>>>;

  #minFrequency = 1;

  #frequencyMap = {} as Record<Key, number>;

  #size = 0;

  constructor(capacity: number) {
    this.#capacity = capacity;
  }

  get size(): number {
    return this.#size;
  }

  get(key: Key): Value | -1 {
    if (!this.#nodeMap[key]) return -1;

    const freq = this.#frequencyMap[key];
    this.buckets[freq]?.deleteByReference(this.#nodeMap[key]);
    if (this.buckets[freq]?.isEmpty) {
      delete this.buckets[freq];
      this.#minFrequency += 1;
    }

    this.#frequencyMap[key] += 1;

    const dll = this.buckets[this.#frequencyMap[key]] || new DoublyLinkedList();
    dll.append({
      key,
      value: this.#nodeMap[key].data.value,
    });

    this.#nodeMap[key] = dll.tail!;
    this.buckets[this.#frequencyMap[key]] = dll;

    return this.#nodeMap[key].data.value;
  }

  put(key: Key, value: Value): this {
    if (!this.#frequencyMap[key] && this.#size < this.#capacity) {
      this.#frequencyMap[key] = 1;
      const freq = this.#frequencyMap[key];

      const dll = this.buckets[freq] ?? new DoublyLinkedList();
      dll.append({ key, value });
      this.#nodeMap[key] = dll.tail!;
      this.buckets[freq] = dll;
      this.#size += 1;
    } else {
      const deletedNode = this.buckets[this.#minFrequency]?.deleteHead();
      delete this.#nodeMap[deletedNode?.data.key!];

      this.#frequencyMap[key] = 1;
      const freq = this.#frequencyMap[key];
      const dll = this.buckets[freq] ?? new DoublyLinkedList();
      dll.append({ key, value });
      this.#nodeMap[key] = dll.tail!;
      this.buckets[freq] = dll;
    }

    return this;
  }
}
