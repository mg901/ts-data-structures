import { BinaryTreeNode } from '@/data-structures/tree/binary-tree-node';
import { Comparator, type CompareFn } from '@/shared/comparator';
import { Nullable } from '@/shared/types';

export class BinarySearchTreeNode<T = any> extends BinaryTreeNode<T> {
  left: Nullable<BinarySearchTreeNode<T>> = null;

  right: Nullable<BinarySearchTreeNode<T>> = null;

  #compare: Comparator<T>;

  #compareFunction?: CompareFn<T>;

  constructor(data: T, nodeDataCompareFn?: CompareFn<T>) {
    super(data);
    this.#compareFunction = nodeDataCompareFn;
    this.#compare = new Comparator(nodeDataCompareFn);
  }

  insert(data: T): BinarySearchTreeNode<T> {
    if (this.data === null) {
      this.data = data;

      return this;
    }

    if (this.#compare.lessThan(data, this.data)) {
      if (this.left) {
        return this.left.insert(data);
      }

      const newNode = new BinarySearchTreeNode(data, this.#compareFunction);
      this.setLeft(newNode);

      return newNode;
    }

    if (this.#compare.greaterThan(data, this.data)) {
      if (this.right) {
        return this.right.insert(data);
      }

      const newNode = new BinarySearchTreeNode(data, this.#compareFunction);
      this.setRight(newNode);

      return newNode;
    }

    return this;
  }

  find(data: T): Nullable<BinarySearchTreeNode> {
    if (this.#compare.equal(this.data, data)) {
      return this;
    }

    if (this.#compare.lessThan(data, this.data) && this.left) {
      return this.left.find(data);
    }

    if (this.#compare.greaterThan(data, this.data) && this.right) {
      return this.right.find(data);
    }

    return null;
  }

  contains(value: T) {
    return Boolean(this.find(value));
  }

  delete(value: T) {
    let nodeToDelete = this.find(value);

    if (nodeToDelete === null) {
      return false;
    }

    const { parent } = nodeToDelete;

    if (parent === null) return false;

    if (nodeToDelete.left === null && nodeToDelete.right === null) {
      parent.deleteChild(nodeToDelete);

      return true;
    }

    if (nodeToDelete.left === null) {
      parent.right = nodeToDelete.right;

      nodeToDelete = null;

      return true;
    }

    if (nodeToDelete.right === null) {
      parent.left = nodeToDelete.left;

      nodeToDelete = null;

      return true;
    }

    const successor = nodeToDelete.right.findMin();
    nodeToDelete.data = successor.data;
    successor.delete(successor.data);

    return true;
  }

  findMin(): BinarySearchTreeNode<T> {
    if (this.left === null) {
      return this;
    }

    return this.left.findMin();
  }

  findMax(): BinarySearchTreeNode<T> {
    if (this.right === null) {
      return this;
    }

    return this.right.findMax();
  }
}
