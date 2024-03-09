import { BinaryTreeNode } from '@/data-structures/tree/binary-tree-node';
import { Comparator, type CompareFunction } from '@/shared/comparator';

export class BinarySearchTreeNode<T = any> extends BinaryTreeNode<T> {
  left: BinarySearchTreeNode<T> | null = null;

  right: BinarySearchTreeNode<T> | null = null;

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
