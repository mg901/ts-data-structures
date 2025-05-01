export class SegmentTree {
  #n: number;

  #tree: number[];

  #lazy: number[];

  constructor(arr: number[]) {
    this.#n = arr.length;
    this.#tree = new Array(this.#n * 4);
    this.#lazy = new Array(this.#n * 4).fill(0);
    this.build(arr, 0, 0, this.#n - 1);
  }

  build(arr: number[], node: number, left: number, right: number): void {
    if (left === right) {
      this.#tree[node] = arr[left];

      return;
    }

    const mid = left + Math.floor((right - left) / 2);
    this.build(arr, node * 2 + 1, left, mid);
    this.build(arr, node * 2 + 2, mid + 1, right);

    this.#tree[node] = this.#tree[node * 2 + 1] + this.#tree[node * 2 + 2];
  }

  update(
    index: number,
    newValue: number,
    node = 0,
    left = 0,
    right = this.#n - 1,
  ): void {
    this.#propagate(node, left, right);

    if (left === right) {
      this.#tree[node] = newValue;

      return;
    }

    const mid = left + Math.floor((right - left) / 2);

    if (index <= mid) {
      this.update(index, newValue, node * 2 + 1, left, mid);
    } else {
      this.update(index, newValue, node * 2 + 2, mid + 1, right);
    }

    this.#tree[node] = this.#tree[node * 2 + 1] + this.#tree[node * 2 + 2];
  }

  updateRange(
    start: number,
    end: number,
    delta: number,
    node = 0,
    left = 0,
    right = this.#n - 1,
  ): void {
    this.#propagate(node, left, right);

    if (start > right || end < left) return;

    if (start <= left && end >= right) {
      this.#lazy[node] += delta;
      this.#propagate(node, left, right);

      return;
    }

    const mid = left + Math.floor((right - left) / 2);
    this.updateRange(start, end, delta, node * 2 + 1, left, mid);
    this.updateRange(start, end, delta, node * 2 + 2, mid + 1, right);

    this.#tree[node] = this.#tree[node * 2 + 1] + this.#tree[node * 2 + 2];
  }

  #propagate(node: number, left: number, right: number) {
    if (this.#lazy[node] === 0) return;

    this.#tree[node] += (right - left + 1) * this.#lazy[node];

    if (left !== right) {
      this.#lazy[node * 2 + 1] += this.#lazy[node];
      this.#lazy[node * 2 + 2] += this.#lazy[node];
    }

    this.#lazy[node] = 0;
  }

  query(
    start: number,
    end: number,
    node = 0,
    left = 0,
    right = this.#n - 1,
  ): number {
    this.#propagate(node, left, right);

    if (start > right || end < left) return 0;

    if (start <= left && end >= right) {
      return this.#tree[node];
    }

    const mid = left + Math.floor((right - left) / 2);
    const leftSum = this.query(start, end, node * 2 + 1, left, mid);
    const rightSum = this.query(start, end, node * 2 + 2, mid + 1, right);

    return leftSum + rightSum;
  }

  getTree() {
    return this.#tree;
  }
}
