import { Node } from '@/shared/node';
import { Nullable } from 'vitest';

export class BinaryTreeNode<T = any> extends Node<T> {
  left: Nullable<BinaryTreeNode<T>>;

  right: Nullable<BinaryTreeNode<T>>;

  constructor(
    data: T,
    left: Nullable<BinaryTreeNode<T>> = null,
    right: Nullable<BinaryTreeNode<T>> = null,
  ) {
    super(data);
    this.left = left;
    this.right = right;
  }
}
