import { BinaryTreeNode } from '@/data-structures/tree/binary-tree-node';
import { Comparator, type CompareFunction } from '@/shared/comparator';
import { Nullable } from '@/shared/types';

export class BinarySearchTreeNode<T = any> extends BinaryTreeNode<T> {
  left: Nullable<BinarySearchTreeNode<T>> = null;

  right: Nullable<BinarySearchTreeNode<T>> = null;

  #compare: Comparator<T>;

  #compareFunction?: CompareFunction<T>;

  constructor(data: T, compareFunction?: CompareFunction<T>) {
    super(data);
    this.#compareFunction = compareFunction;
    this.#compare = new Comparator(compareFunction);
  }

  insert(value: T): BinarySearchTreeNode<T> {
    if (this.#compare.equal(this.data, null)) {
      this.data = value;

      return this;
    }

    if (this.#compare.lessThan(value, this.data)) {
      if (this.left) {
        return this.left.insert(value);
      }

      const newNode = new BinarySearchTreeNode(value, this.#compareFunction);
      this.setLeft(newNode);

      return newNode;
    }

    if (this.#compare.greaterThan(value, this.data)) {
      if (this.right) {
        return this.right.insert(value);
      }

      const newNode = new BinarySearchTreeNode(value, this.#compareFunction);
      this.setRight(newNode);

      return newNode;
    }

    return this;
  }

  find(value: T): Nullable<BinarySearchTreeNode> {
    if (this.#compare.equal(this.data, value)) {
      return this;
    }

    if (this.#compare.lessThan(value, this.data) && this.left) {
      return this.left.find(value);
    }

    if (this.#compare.greaterThan(value, this.data) && this.right) {
      return this.right.find(value);
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
