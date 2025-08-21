// Explanation:

export class DisjointSet {
  #parent;

  #rank;

  constructor(size: number) {
    this.#parent = Array.from({ length: size }, (_, i) => i);
    this.#rank = new Uint32Array(size);
  }

  find(x: number) {
    if (this.#parent[x] !== x) {
      this.#parent[x] = this.find(this.#parent[x]);
    }

    return this.#parent[x];
  }

  union(a: number, b: number) {
    const rootA = this.find(a);
    const rootB = this.find(b);

    if (rootA === rootB) return false;

    if (this.#rank[rootA] < this.#rank[rootB]) {
      this.#parent[rootA] = rootB;
    } else if (this.#rank[rootA] > this.#rank[rootB]) {
      this.#parent[rootB] = rootA;
    } else {
      this.#parent[rootB] = rootA;
      this.#rank[rootA] += 1;
    }

    return true;
  }

  connected(a: number, b: number) {
    return this.find(a) === this.find(b);
  }
}
