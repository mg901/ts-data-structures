import { Queue } from '@/data-structures/queue';
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
  deleteChild(node: BinaryTreeNode<T>): boolean;
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

  deleteChild(node: BinaryTreeNode<T>) {
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

  dfsTraversal(type: 'preOrder' | 'inOrder' | 'postOrder') {
    let result: T[] = [];

    const traverse = (node: Nullable<BinaryTreeNode<T>>) => {
      if (node === null) return;

      if (type === 'preOrder') result.push(node.data);
      traverse(node.left);
      if (type === 'inOrder') result.push(node.data);
      traverse(node.right);
      if (type === 'postOrder') result.push(node.data);
    };

    traverse(this);

    return result;
  }

  bfsTraversal() {
    let result: T[] = [];
    const queue = Queue.of<BinaryTreeNode<T>>(this);

    while (queue.size > 0) {
      const node = queue.dequeue()!;
      result.push(node.data);

      if (node.left) {
        queue.enqueue(node.left);
      }

      if (node.right) {
        queue.enqueue(node.right);
      }
    }

    return result;
  }
}
