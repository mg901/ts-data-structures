import { LinkedListNode } from './linked-list-node';

type NullableLinkedListNode<T = any> = LinkedListNode<T> | null;
type FindMethodOptions<T = any> = {
  value?: T;
  predicate?: (value: T) => boolean;
};

export interface LinkedListType<T> {
  readonly head: NullableLinkedListNode<T>;
  readonly tail: NullableLinkedListNode<T>;
  readonly length: number;
  readonly isEmpty: boolean;

  toArray(): T[];
  toString(): string;
  append(value: T): this;
  prepend(value: T): this;
  reverse(): this;
  delete(value: T): NullableLinkedListNode<T>;
  insertAt(index: number, value: T): this;
  deleteHead(): NullableLinkedListNode<T>;
  deleteTail(): NullableLinkedListNode<T>;
  indexOf(value: T): number;
  fromArray(array: T[]): this;
  find(options: FindMethodOptions<T>): NullableLinkedListNode<T>;
}

export class LinkedList<T = any> implements LinkedListType<T> {
  #head: NullableLinkedListNode<T> = null;

  #tail: NullableLinkedListNode<T> = null;

  #length: number = 0;

  get isEmpty() {
    return this.#head === null;
  }

  get head() {
    return this.#head;
  }

  get tail() {
    return this.#tail;
  }

  get length(): number {
    return this.#length;
  }

  toArray() {
    const array = [];
    let currentNode = this.#head;

    while (currentNode) {
      array.push(currentNode.value);
      currentNode = currentNode.next;
    }

    return array;
  }

  toString() {
    return this.toArray().toString();
  }

  append(value: T) {
    const newNode = new LinkedListNode(value);

    if (this.#head === null) {
      this.#head = newNode;
      this.#tail = newNode;
    } else {
      this.#tail!.next = newNode;
      this.#tail = newNode;
    }

    this.#length += 1;

    return this;
  }

  prepend(value: T) {
    const newNode = new LinkedListNode(value);

    if (this.#head === null) {
      this.#head = newNode;
      this.#tail = newNode;
    } else {
      newNode.next = this.#head;
      this.#head = newNode;
    }

    this.#length += 1;

    return this;
  }

  delete(value: T) {
    if (this.#head === null) return null;

    let deletedNode = null as NullableLinkedListNode;

    // Delete from the beginning of the list
    if (value === this.#head.value) {
      deletedNode = this.#head;
      this.#head = deletedNode.next;

      // Update tail if the list becomes empty
      if (this.#head === null) {
        this.#tail = null;
      }
    } else {
      let currentNode = this.#head;

      // Search for the node by value
      while (currentNode.next && value !== currentNode.next.value) {
        currentNode = currentNode.next;
      }

      // Delete the node from the middle
      if (currentNode.next !== null) {
        deletedNode = currentNode.next;
        currentNode.next = deletedNode?.next;

        // Update tail if the last node is deleted
        if (currentNode.next === null) {
          this.#tail = currentNode;
        }
      }
    }

    if (deletedNode) {
      this.#length -= 1;
    }

    return deletedNode;
  }

  reverse() {
    if (this.#head === null || this.#head.next === null) return this;

    let currentNode = this.#head as NullableLinkedListNode;
    let prevNode = null;

    while (currentNode) {
      const nextNode = currentNode.next;
      [currentNode.next, prevNode] = [prevNode, currentNode];

      currentNode = nextNode;
    }

    this.#tail = this.#head;
    this.#head = prevNode;

    return this;
  }

  #findNodeByIndex(index: number): LinkedListNode<T> {
    let currentNode = this.#head!;

    for (let i = 0; i < index; i += 1) {
      currentNode = currentNode.next!;
    }

    return currentNode;
  }

  insertAt(index: number, value: T): this {
    if (index < 0 || index > this.#length) {
      throw new Error(
        'Index should be greater than or equal to 0 and less than or equal to the list length.',
      );
    }

    if (index === 0) {
      // Insert at the beginning
      this.prepend(value);
    } else if (index === this.#length) {
      // Insert end
      this.append(value);
    } else {
      // Insert in the middle
      const prevNode = this.#findNodeByIndex(index - 1);
      const newNode = new LinkedListNode(value);

      newNode.next = prevNode.next;
      prevNode.next = newNode;

      this.#length += 1;
    }

    return this;
  }

  deleteHead() {
    if (this.#head === null) return null;

    const deletedNode = this.#head;

    if (this.#head?.next) {
      this.#head = this.#head.next;
    } else {
      this.#head = null;
      this.#tail = null;
    }

    this.#length -= 1;

    return deletedNode;
  }

  deleteTail() {
    if (this.#head === null) return null;

    const deletedTail = this.#tail;

    // If there is only one node.
    if (this.#head === this.#tail) {
      this.#head = null;
      this.#tail = null;
    } else {
      // If multiple nodes.
      let currentNode = this.#head;

      while (currentNode?.next?.next) {
        currentNode = currentNode.next;
      }

      currentNode.next = null;
      this.#tail = currentNode;
    }

    this.#length -= 1;

    return deletedTail;
  }

  indexOf(value: T) {
    let count = 0;
    let currentNode = this.head;

    while (currentNode) {
      if (value === currentNode.value) return count;

      currentNode = currentNode.next;
      count += 1;
    }

    return -1;
  }

  fromArray(array: T[]) {
    array.forEach((value) => {
      this.append(value);
    });

    return this;
  }

  find({ value, predicate }: FindMethodOptions<T>) {
    if (this.#head === null) return null;

    let currentNode = this.head as NullableLinkedListNode;

    while (currentNode) {
      if (predicate && predicate(currentNode.value)) {
        return currentNode;
      }

      if (value !== undefined && value === currentNode.value) {
        return currentNode;
      }

      currentNode = currentNode.next;
    }

    return null;
  }
}
