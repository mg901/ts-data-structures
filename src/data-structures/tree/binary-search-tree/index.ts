import { type CompareFunction } from '@/shared/comparator';
import { Callback } from '@/shared/node';
import { BinarySearchTreeNode } from './binary-search-tree-node';

export class BinarySearchTree<T = any> {
  root: BinarySearchTreeNode<T>;

  constructor(nodeDataCompareFn?: CompareFunction<T>) {
    // @ts-ignore
    this.root = new BinarySearchTreeNode(null, nodeDataCompareFn);
  }

  insert(data: T) {
    return this.root.insert(data);
  }

  find(data: T) {
    return this.root.find(data);
  }

  contains(data: T) {
    return this.root.contains(data);
  }

  delete(data: T) {
    return this.root.delete(data);
  }

  findMin() {
    return this.root.findMin();
  }

  findMax() {
    return this.root.findMax();
  }

  toString(callback: Callback<T>) {
    return this.root.toString(callback);
  }
}
