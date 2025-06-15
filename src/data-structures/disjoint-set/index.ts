export class DisjointSet {
  #parent: number[];

  #rank: number[];

  constructor(size: number) {
    this.#parent = [];
    this.#rank = [];

    for (let i = 0; i < size; i += 1) {
      this.#parent[i] = i;
      this.#rank[i] = 0;
    }
  }

  find(x: number): number {
    if (this.#parent[x] !== x) {
      this.#parent[x] = this.find(this.#parent[x]);
    }

    return this.#parent[x];
  }

  union(x: number, y: number) {
    const rootX = this.find(x);
    const rootY = this.find(y);

    if (rootX === rootY) return;

    if (this.#rank[rootX] < this.#rank[rootY]) {
      this.#parent[rootX] = rootY;
    } else if (this.#rank[rootX] > this.#rank[rootY]) {
      this.#parent[rootY] = rootX;
    } else {
      this.#parent[rootY] = rootX;
      this.#rank[rootX] += 1;
    }
  }

  connected(x: number, y: number) {
    return this.find(x) === this.find(y);
  }
}
