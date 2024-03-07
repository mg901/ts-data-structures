import { Nullable } from '@/shared/types';
import { BinaryTreeNode } from './node';

export class BinaryTree<T> {
  root: Nullable<BinaryTreeNode<T>> = null;

  insert(value: T) {
    if (this.root === null) {
      this.root = new BinaryTreeNode(value);
    } else {
      this.#insertNode(this.root, value);
    }
  }

  #insertNode<U>(node: BinaryTreeNode<U>, value: U) {
    const newNode = new BinaryTreeNode(value);

    if (value <= node.data) {
      if (node.left === null) {
        node.left = newNode;
      } else {
        this.#insertNode(node.left!, value);
      }
    } else if (node.right === null) {
      node.right = newNode;
    } else {
      this.#insertNode(node.right!, value);
    }
  }
}
