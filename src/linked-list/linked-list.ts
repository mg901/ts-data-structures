import { BaseLinkedList, type SearchOptions } from '@/shared/base-linked-list';
import { LinkedListNode } from './linked-list-node';

export class LinkedList<T = any> extends BaseLinkedList<T, LinkedListNode<T>> {
  append(value: T): this {
    const newNode = new LinkedListNode(value);

    if (this.$head === null) {
      this.$head = newNode;
      this.$tail = newNode;
    } else {
      this.$tail!.next = newNode;
      this.$tail = newNode;
    }

    this.$size += 1;

    return this;
  }

  prepend(value: T): this {
    const newNode = new LinkedListNode(value);

    if (this.$head === null) {
      this.$head = newNode;
      this.$tail = newNode;
    } else {
      newNode.next = this.$head;
      this.$head = newNode;
    }

    this.$size += 1;

    return this;
  }

  deleteByValue(options: SearchOptions<T>) {
    if (this.$head === null) return null;

    let deletedNode: LinkedListNode | null = null;

    if (this.$isMatch(this.$head.value, options)) {
      deletedNode = this.#deleteHeadAndUpdateTail();
    } else {
      let currentNode = this.$head;

      while (
        currentNode.next &&
        !this.$isMatch(currentNode.next.value, options)
      ) {
        currentNode = currentNode.next;
      }

      deletedNode = this.#deleteNodeAndUpdateTail(currentNode);
    }

    if (deletedNode) {
      // Clear the reference of the deleted node.
      deletedNode.next = null;
      this.$size -= 1;
    }

    return deletedNode;
  }

  #deleteHeadAndUpdateTail() {
    const deletedNode = this.$head;

    if (deletedNode?.next) {
      this.$head = deletedNode.next;
    } else {
      this.$head = null;
      this.$tail = null;
    }

    return deletedNode;
  }

  #deleteNodeAndUpdateTail(prevNode: LinkedListNode<T>) {
    let deletedNode: LinkedListNode | null = null;

    // Delete the node from the middle.
    if (prevNode.next !== null) {
      deletedNode = prevNode.next;
      prevNode.next = deletedNode?.next;

      // Update tail if the last node is deleted.
      if (prevNode.next === null) {
        this.$tail = prevNode;
      }
    }

    return deletedNode;
  }

  reverse(): this {
    if (this.$head === null || this.$head.next === null) {
      return this;
    }

    let currentNode = this.$head as LinkedListNode | null;
    let prevNode = null;

    while (currentNode !== null) {
      const nextNode = currentNode.next;
      currentNode.next = prevNode;
      prevNode = currentNode;

      currentNode = nextNode;
    }

    this.$tail = this.$head;
    this.$head = prevNode;

    return this;
  }

  insertAt(index: number, value: T): this {
    const isInvalidIndex = index < 0 || index > this.$size;

    if (isInvalidIndex) {
      throw new Error(
        'Index should be greater than or equal to 0 and less than or equal to the list length.',
      );
    }

    if (index === 0) {
      // Insert at the beginning.
      this.prepend(value);
    } else if (index === this.$size) {
      // Insert at the end.
      this.append(value);
    } else {
      // Insert in the middle.
      const prevNode = this.$findNodeByIndex(index - 1);
      const newNode = new LinkedListNode(value);

      newNode.next = prevNode.next;
      prevNode.next = newNode;

      this.$size += 1;
    }

    return this;
  }

  deleteHead() {
    if (this.$head === null) return null;

    const deletedNode = this.$head;

    if (deletedNode?.next) {
      this.$head = deletedNode.next;
    } else {
      this.$head = null;
      this.$tail = null;
    }

    this.$size -= 1;

    return deletedNode;
  }

  deleteTail() {
    if (this.$head === null) return null;

    const deletedTail = this.$tail;

    // If there is only one node.
    if (this.$head === this.$tail) {
      this.$head = null;
      this.$tail = null;
    } else {
      // If multiple nodes.
      let currentNode = this.$head;

      while (currentNode?.next?.next) {
        currentNode = currentNode.next;
      }

      currentNode.next = null;
      this.$tail = currentNode;
    }

    this.$size -= 1;

    return deletedTail;
  }

  find(options: SearchOptions<T>) {
    if (this.$head === null) return null;

    let currentNode: LinkedListNode | null = this.$head;

    while (currentNode) {
      if (this.$isMatch(currentNode.value, options)) {
        return currentNode;
      }

      currentNode = currentNode.next;
    }

    return null;
  }
}
