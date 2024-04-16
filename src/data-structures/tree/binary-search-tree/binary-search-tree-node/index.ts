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

  insert(value: T) {
    const newNode = new BinarySearchTreeNode(value);

    if (this.#compare.lessThan(value, this.data)) {
      if (this.left === null) {
        this.setLeft(newNode);
      } else {
        this.left.insert(value);
      }
    } else if (this.right === null) {
      this.setRight(newNode);
    } else {
      this.right.insert(value);
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
    const nodeToRemove = this.find(value);

    if (!nodeToRemove) {
      throw new Error('Item is not found in the tree');
    }

    const { parent } = nodeToRemove!;

    if (nodeToRemove.left === null && nodeToRemove.right === null) {
      // Check is a leaf?
      if (parent) {
        parent.removeChild(nodeToRemove);
      } else {
        // @ts-ignore
        this.data = null;
      }
    }

    return true;
  }

  findMin(): BinarySearchTreeNode {
    if (this.left === null) {
      return this;
    }

    return this.left.findMin();
  }
}
