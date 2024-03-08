import { Node } from '@/shared/node';
import { Nullable } from 'vitest';

export class BinaryTreeNode<T = any> extends Node<T> {
  parent: Nullable<BinaryTreeNode<T>> = null;

  left: Nullable<BinaryTreeNode<T>>;

  right: Nullable<BinaryTreeNode<T>>;

  setLeft(node: BinaryTreeNode<T>) {
    if (this.left) {
      this.left.parent = null;
    }

    this.left = node;

    if (this.left) {
      this.left.parent = this;
    }

    return this;
  }

  setRight(node: BinaryTreeNode<T>) {
    if (this.right) {
      this.right.parent = null;
    }

    this.right = node;

    if (this.right) {
      this.right.parent = this;
    }

    return this;
  }
}
