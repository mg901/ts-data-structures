export class SegmentTree {
  #length: number;

  #tree: number[];

  constructor(arr: number[]) {
    this.#length = arr.length;
    this.#tree = new Array(this.#length * 4);
    this.build(arr, 0, 0, this.#length - 1);
  }

  build(arr: number[], node: number, left: number, right: number) {
    if (left === right) {
      this.#tree[node] = arr[left];

      return;
    }

    const mid = left + Math.floor((right - left) / 2);
    this.build(arr, node * 2 + 1, left, mid);
    this.build(arr, node * 2 + 2, mid + 1, right);

    this.#tree[node] = this.#tree[node * 2 + 1] + this.#tree[node * 2 + 2];
  }

  getTree() {
    return this.#tree;
  }
}
