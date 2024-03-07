import { Nullable } from '@/shared/types';
import { BinaryTreeNode } from './node';

export class BinaryTree<T> {
  root: Nullable<BinaryTreeNode<T>> = null;

  setRootValue(value: T) {
    this.root = new BinaryTreeNode(value);
  }
}
