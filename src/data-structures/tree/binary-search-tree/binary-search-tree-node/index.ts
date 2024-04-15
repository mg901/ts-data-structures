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
    const newNode = new BinarySearchTreeNode(value, this.#compareFunction);

    if (this.#compare.lessThan(value, this.data)) {
      if (this.left === null) {
        this.setLeft(newNode);

        return newNode;
      }

      this.left.insert(value);
    } else {
      if (this.right === null) {
        this.setRight(newNode);

        return newNode;
      }
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

  findMin(): BinarySearchTreeNode {
    if (this.left === null) {
      return this;
    }

    return this.left.findMin();
  }
}
