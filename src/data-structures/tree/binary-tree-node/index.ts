import { Node } from '@/shared/node';
import { Nullable } from '@/shared/types';

export interface IBinaryTreeNode<T> {
  parent: Nullable<BinaryTreeNode<T>>;
  left: Nullable<BinaryTreeNode<T>>;
  right: Nullable<BinaryTreeNode<T>>;
  get height(): number;
  get leftHeight(): number;
  get rightHeight(): number;
  setLeft(node: BinaryTreeNode<T>): this;
  setRight(node: BinaryTreeNode<T>): this;
  removeChild(node: BinaryTreeNode<T>): boolean;
}

export class BinaryTreeNode<T = any>
  extends Node<T>
  implements IBinaryTreeNode<T>
{
  parent: Nullable<BinaryTreeNode<T>> = null;

  left: Nullable<BinaryTreeNode<T>> = null;

  right: Nullable<BinaryTreeNode<T>> = null;

  get height() {
    return Math.max(this.leftHeight, this.rightHeight);
  }

  get leftHeight(): number {
    if (this.left === null) {
      return 0;
    }

    return this.left!.height + 1;
  }

  get rightHeight(): number {
    if (this.right === null) {
      return 0;
    }

    return this.right!.height + 1;
  }

  get balanceFactor() {
    return this.leftHeight - this.rightHeight;
  }

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

  removeChild(node: BinaryTreeNode<T>) {
    if (this.left === node) {
      this.left = null;

      return true;
    }

    if (this.right === node) {
      this.right = null;

      return true;
    }

    return false;
  }
}
