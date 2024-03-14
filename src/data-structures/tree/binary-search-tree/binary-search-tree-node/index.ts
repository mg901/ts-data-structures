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
}
