import { BaseLinkedList, type Matcher } from '@/shared/base-linked-list';
import { DoublyLinkedListNode as Node } from './doubly-linked-list-node';

export class DoublyLinkedList<T = any> extends BaseLinkedList<T, Node<T>> {
  append(value: T) {
    const newNode = new Node(value);

    if (this.$head === null) {
      this.$head = newNode;
      this.$tail = newNode;
    } else {
      this.$tail!.next = newNode;
      newNode.prev = this.$tail;
      this.$tail = newNode;
    }

    this.$size += 1;

    return this;
  }

  prepend(value: T): this {
    const newNode = new Node(value);

    if (this.$head === null) {
      this.$head = newNode;
      this.$tail = newNode;
    } else {
      newNode.next = this.$head;
      this.$head.prev = newNode;
      this.$head = newNode;
    }

    this.$size += 1;

    return this;
  }

  deleteByValue(options: Matcher<T>) {
    if (this.$head === null) return null;

    let deletedNode: Node | null = this.$head;

    // Search for the node by value.
    while (deletedNode !== null && !this.$isMatch(deletedNode.value, options)) {
      deletedNode = deletedNode.next;
    }

    if (deletedNode === null) return null;

    if (deletedNode.prev !== null) {
      deletedNode.prev.next = deletedNode.next;
    } else {
      // Deleted node is the head;
      this.$head = deletedNode.next;
    }

    // Delete the node from the middle.
    if (deletedNode.next !== null) {
      deletedNode.next.prev = deletedNode.prev;
    } else {
      // Deleted node is the tail
      this.$tail = deletedNode.prev;
    }

    // Clear the reference of the deleted node.
    deletedNode.prev = null;
    deletedNode.next = null;

    this.$size -= 1;

    return deletedNode;
  }

  reverse() {
    if (this.$head === null || this.$head.next === null) {
      return this;
    }

    let prevNode = null;
    let currentNode = this.$head as Node | null;

    while (currentNode !== null) {
      const nextNode = currentNode.next;
      currentNode.next = prevNode;
      currentNode.prev = nextNode;
      prevNode = currentNode;

      currentNode = nextNode;
    }

    this.$tail = this.$head;
    this.$head = prevNode;

    return this;
  }

  insertAt(index: number, value: T) {
    const isInvalidIndex = index < 0 || index > this.$size;

    if (isInvalidIndex) {
      throw new Error(
        'Index should be greater than or equal to 0 and less than or equal to the list length.',
      );
    }

    if (index === 0) {
      // Insert at the beginning.
      this.prepend(value);
      // Insert at the end.
    } else if (index === this.$size) {
      this.append(value);
    } else {
      // Insert in the middle.
      let prevNode = this.$findNodeByIndex(index - 1);
      let newNode = new Node(value);
      newNode.next = prevNode.next;
      newNode.prev = prevNode;
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
      this.$head.prev = null;
    }

    this.$size -= 1;

    return deletedNode;
  }

  deleteTail() {
    if (this.$head === null) return null;

    // If there is only one node.
    if (this.$head === this.$tail) {
      const deletedNode = this.$tail;
      this.$head = null;
      this.$tail = null;

      this.$size -= 1;

      return deletedNode;
    }

    const deletedNode = this.tail!;

    this.$tail = deletedNode.prev!;
    this.$tail.next = null;

    this.$size -= 1;

    return deletedNode;
  }

  find(options: Matcher<T>) {
    if (this.$head === null) return null;

    let currentNode: Node | null = this.$head;

    while (currentNode) {
      if (this.$isMatch(currentNode.value, options)) {
        return currentNode;
      }

      currentNode = currentNode.next;
    }

    return null;
  }
}
