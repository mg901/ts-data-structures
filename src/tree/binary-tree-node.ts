// import { Comparator } from 'shared/comparator';

type NullableBinaryTreeNode<T> = BinaryTreeNode<T> | null;

export class BinaryTreeNode<T = any> {
  // #comparator: Comparator<T>;

  constructor(
    public value: T,
    public parent: NullableBinaryTreeNode<T> = null,
    public left: NullableBinaryTreeNode<T> = null,
    public right: NullableBinaryTreeNode<T> = null,
  ) {
    // this.#comparator = new Comparator<T>();
  }

  setValue(value: T): this {
    this.value = value;

    return this;
  }

  setLeft(node: BinaryTreeNode<T>): this {
    if (node) {
      this.parent = null;
    }

    this.left = node;

    if (this.left) {
      this.parent = this;
    }

    return this;
  }

  setRight(node: BinaryTreeNode<T>): this {
    if (node) {
      this.parent = null;
    }

    this.right = node;

    if (node.right) {
      this.parent = this;
    }

    return this;
  }

  // removeChild(node: BinaryTreeNode<T>) {
  //   if (this.left && this.#comparator.equal(node.value, this.left.value)) {
  //     let removedNode = this.left;
  //     this.left = null;

  //     return removedNode;
  //   }

  //   if (this.right && this.#comparator.equal(node.value, this.right.value)) {
  //     let removedNode = this.right;
  //     this.right = null;

  //     return removedNode;
  //   }

  //   return null;
  // }
}
