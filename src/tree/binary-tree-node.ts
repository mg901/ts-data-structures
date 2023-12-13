import { Comparator } from '../shared/comparator';

type NullableBinaryTreeNode<T> = BinaryTreeNode<T> | null;

export class BinaryTreeNode<T = any> {
  #compare: Comparator<T>;

  constructor(
    public value: T,
    public parent: NullableBinaryTreeNode<T> = null,
    public left: NullableBinaryTreeNode<T> = null,
    public right: NullableBinaryTreeNode<T> = null,
  ) {
    this.#compare = new Comparator<T>();
  }

  setValue(value: T): this {
    this.value = value;

    return this;
  }

  setLeft(node: BinaryTreeNode<T>): this {
    // Remove parent for existing node.
    if (this.left) {
      this.left.parent = null;
    }

    // Attach new node.
    this.left = node;

    // Make the current node the parent for the new node.
    if (this.left) {
      this.left.parent = this;
    }

    return this;
  }

  setRight(node: BinaryTreeNode<T>): this {
    // Remove parent for existing node.
    if (this.right) {
      this.right.parent = null;
    }

    // Attach new node.
    this.right = node;

    // Make the current node the parent for the new node.
    if (node) {
      this.right.parent = this;
    }

    return this;
  }

  removeChild(node: BinaryTreeNode<T>) {
    if (this.left && this.#compare.equal(node.value, this.left.value)) {
      let removedNode = this.left;
      removedNode.parent = null;
      this.left = null;

      return removedNode;
    }

    if (this.right && this.#compare.equal(node.value, this.right.value)) {
      let removedNode = this.right;
      removedNode.parent = null;
      this.right = null;

      return removedNode;
    }

    return null;
  }
}
