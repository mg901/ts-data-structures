import { DoublyLinkedList } from '../linked-lists/doubly-linked-list';
import { DoublyLinkedListNode } from '../linked-lists/doubly-linked-list/node';

type Payload<Key, Value> = {
  key: Key;
  value: Value;
};

export class MFUCache<Key extends string | number | symbol, Value> {
  #capacity: number;

  #nodeMap = new Map() as Map<Key, DoublyLinkedListNode<Payload<Key, Value>>>;

  #frequencyMap = new Map() as Map<Key, number>;

  #buckets = new Map() as Map<
    number,
    DoublyLinkedList<Payload<Key, Value>> | undefined
  >;

  #maxFrequency = 1;

  #size = 0;

  constructor(capacity: number) {
    this.#capacity = capacity;
  }

  get size(): number {
    return this.#size;
  }

  get(key: Key): Value | null {
    if (!this.#nodeMap.get(key)) return null;

    // Get actual frequency
    const oldFreq = this.#frequencyMap.get(key)!;
    const bucket = this.#buckets.get(oldFreq);
    const node = this.#nodeMap.get(key)!;

    // Delete item by reference
    bucket?.deleteByRef(node);

    // Remove DLL if is empty.
    if (this.#buckets.get(oldFreq)?.isEmpty) {
      this.#buckets.delete(oldFreq);
    }

    // Update frequency
    this.#frequencyMap.set(key, oldFreq + 1);

    // Update max frequency if needed
    this.#maxFrequency = Math.max(
      this.#maxFrequency,
      this.#frequencyMap.get(key)!,
    );

    const freq = this.#frequencyMap.get(key)!;

    // Get DLL of create it
    const dll =
      this.#buckets.get(freq) ?? new DoublyLinkedList<Payload<Key, Value>>();

    // Add Item to the DLL
    dll.append({
      key,
      value: this.#nodeMap.get(key)!.data.value,
    });

    // Update reference
    this.#nodeMap.set(key, dll.tail!);

    // Update DLL
    this.#buckets.set(freq, dll);

    // console.log('nodeMap', this.#nodeMap);
    // console.log('maxFrequency ^^^^^', this.#maxFrequency);
    // console.log('freqMap', this.#frequencyMap);
    // console.log(
    //   'buckets ---------- 1',
    //   this.#buckets.get(1)?.toString((x) => x.key),
    //   ' size',
    //   this.#buckets.get(1)?.size,
    // );
    // console.log(
    //   'buckets ---------- 2',
    //   this.#buckets.get(2)?.toString((x) => x.key),
    //   ' size',
    //   this.#buckets.get(2)?.size,
    // );
    // console.log(
    //   'buckets ---------- 3',
    //   this.#buckets.get(3)?.toString((x) => x.key),
    //   ' size',
    //   this.#buckets.get(3)?.size,
    // );

    return this.#nodeMap.get(key)?.data.value as Value;
  }

  put(key: Key, value: Value): this {
    // Overwrite the value by the key
    if (this.#nodeMap.has(key)) {
      // Get actual frequency
      const oldFreq = this.#frequencyMap.get(key)!;

      // Get bucket by frequency
      const bucket = this.#buckets.get(oldFreq);

      // Remove item by reference
      bucket?.deleteByRef(this.#nodeMap.get(key)!);

      if (this.#buckets.get(oldFreq)?.isEmpty) this.#buckets.delete(oldFreq);

      this.#size -= 1;

      this.#frequencyMap.set(key, this.#frequencyMap.get(key)! + 1);
    }

    if (this.#size === this.#capacity) {
      // Get the most frequently bucket
      const bucket = this.#buckets.get(this.#maxFrequency);

      // Delete item
      const deletedNode = bucket?.deleteTail()!;

      if (bucket?.isEmpty) this.#buckets.delete(this.#maxFrequency);

      // Remove mfu frequency
      this.#frequencyMap.delete(deletedNode.data.key);

      // Remove reverence to the mfu item;
      this.#nodeMap.delete(deletedNode.data.key);

      // Decrease max frequency
      this.#maxFrequency -= 1;
      this.#size -= 1;
    }

    // Add item
    const INITIAL_FREQUENCY = 1;
    // Get frequency value or set initial.
    this.#frequencyMap.set(
      key,
      this.#frequencyMap.get(key) ?? INITIAL_FREQUENCY,
    );

    const freq = this.#frequencyMap.get(key)!;

    // Create DLL
    const dll =
      this.#buckets.get(freq) ?? new DoublyLinkedList<Payload<Key, Value>>();

    // Add item
    dll.append({ key, value });

    // Update DLL
    this.#buckets.set(freq, dll);

    // Update reference
    this.#nodeMap.set(key, dll.tail!);

    this.#size += 1;

    // console.log('nodeMap', this.#nodeMap);
    // console.log('maxFrequency ^^^^^', this.#maxFrequency);
    // console.log('freqMap', this.#frequencyMap);
    // console.log(
    //   'buckets ---------- 1',
    //   this.#buckets.get(1)?.toString((x) => x.key),
    //   ' size',
    //   this.#buckets.get(1)?.size,
    // );
    // console.log(
    //   'buckets ---------- 2',
    //   this.#buckets.get(2)?.toString((x) => x.key),
    //   ' size',
    //   this.#buckets.get(2)?.size,
    // );
    // console.log(
    //   'buckets ---------- 3',
    //   this.#buckets.get(3)?.toString((x) => x.key),
    //   ' size',
    //   this.#buckets.get(3)?.size,
    // );

    return this;
  }
}
