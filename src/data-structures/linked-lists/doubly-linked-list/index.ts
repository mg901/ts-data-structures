import { LinkedList, type Predicate } from '@/shared/linked-list/linked-list';
import { Nullable } from '@/shared/types';
import { DoublyLinkedListNode } from './node';

export { DoublyLinkedListNode };

export class DoublyLinkedList<
  T = any,
  Node extends DoublyLinkedListNode<T> = DoublyLinkedListNode<T>,
> extends LinkedList<T, Node> {
  append(value: T) {
    const newNode = new DoublyLinkedListNode(value) as Node;

    if (this._head === null) {
      this._initializeList(newNode);
    } else {
      this._tail!.next = newNode;
      newNode.prev = this._tail;
      this._tail = newNode;

      this._increaseSize();
    }

    return this;
  }

  fromArray(array: T[]) {
    array.forEach((value) => {
      this.append(value);
    });

    return this;
  }

  prepend(value: T) {
    const newNode = new DoublyLinkedListNode(value) as Node;

    if (this._head === null) {
      this._initializeList(newNode);
    } else {
      newNode.next = this._head;
      this._head.prev = newNode;
      this._head = newNode;

      this._increaseSize();
    }

    return this;
  }

  insertAt(index: number, value: T) {
    this._throwIsInvalidIndex(index);

    if (index === 0) {
      // At the beginning.
      this.prepend(value);
      // At the end.
    } else if (index === this._size) {
      this.append(value);
    } else {
      // In the middle.
      let prevNode = this._findNodeByIndex(index - 1);
      let newNode = new DoublyLinkedListNode(value);
      newNode.next = prevNode.next;
      newNode.prev = prevNode;
      prevNode.next = newNode;

      this._increaseSize();
    }

    return this;
  }

  deleteByValue(value: T): Nullable<Node>;
  deleteByValue(predicate: Predicate<T>): Nullable<Node>;
  deleteByValue(arg: T | Predicate<T>) {
    if (this._head === null) return null;

    let deletedNode: Nullable<Node> = null;

    for (const currentNode of this) {
      if (this._isMatch(currentNode.data, arg)) {
        deletedNode = currentNode;

        break;
      }
    }

    if (deletedNode) {
      // In the middle.
      if (deletedNode.prev) {
        deletedNode.prev.next = deletedNode.next;
      } else {
        // At the beginning.
        this._head = deletedNode.next as Node;
      }

      // In the middle.
      if (deletedNode.next) {
        deletedNode.next.prev = deletedNode.prev;
      } else {
        // At the end.
        this._tail = deletedNode.prev as Node;
      }

      detachNode(deletedNode);
      this._decreaseSize();
    }

    return deletedNode;
  }

  deleteByRef(ref: Node) {
    if (!this.#isNodeInList(ref)) return;

    // In the middle.
    if (ref.prev) {
      ref.prev.next = ref.next;
    } else {
      // At the beginning.
      this._head = ref.next as Node;
    }

    // In the middle.
    if (ref.next) {
      ref.next.prev = ref.prev;
    } else {
      // At the end.
      this._tail = ref.prev as Node;
    }

    detachNode(ref);
    this._decreaseSize();
  }

  #isNodeInList(ref: Node) {
    return (
      ref && (ref === this.head || ref === this.tail || ref.prev || ref.next)
    );
  }

  deleteHead() {
    if (this._head === null) return null;

    const deletedNode = this._head;

    if (deletedNode?.next) {
      this._head = deletedNode.next as Node;
      this._head.prev = null;

      deletedNode.next = null;
      this._decreaseSize();
    } else {
      this.clear();
    }

    return deletedNode;
  }

  deleteTail() {
    if (this._head === null) return null;

    const deletedNode = this.tail!;

    // If there is only one node.
    if (deletedNode.prev) {
      this._tail = deletedNode.prev! as Node;
      this._tail.next = null;

      deletedNode.prev = null;
      this._decreaseSize();
    } else {
      this.clear();
    }

    return deletedNode;
  }

  reverse() {
    if (this._head === null || this._head.next === null) {
      return this;
    }

    let prev = null;
    let current = this._head as Nullable<Node>;

    while (current !== null) {
      const nextNode = current.next;
      current.next = prev;
      current.prev = nextNode;
      prev = current;

      current = nextNode as Node;
    }

    this._tail = this._head;
    this._head = prev;

    return this;
  }

  get [Symbol.toStringTag]() {
    return `${this.constructor.name}`;
  }
}

function detachNode(node: DoublyLinkedListNode) {
  node.next = null;
  node.prev = null;
}
