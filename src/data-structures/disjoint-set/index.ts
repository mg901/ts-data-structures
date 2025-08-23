// Explanation:
// - Hello Byte: https://youtu.be/92UpvDXc8fs?si=rEbdXNPEIm_g97NK&t=237

export class DisjointSet {
  #parent;

  #rank;

  constructor(n: number) {
    this.#parent = Array.from({ length: n }, (_, i) => i);
    this.#rank = new Uint32Array(n);
  }

  find(x: number) {
    if (this.#parent[x] !== x) {
      this.#parent[x] = this.find(this.#parent[x]);
    }

    return this.#parent[x];
  }

  union(x: number, y: number) {
    const rootX = this.find(x);
    const rootY = this.find(y);

    if (rootX === rootY) return false;

    if (this.#rank[rootX] < this.#rank[rootY]) {
      this.#parent[rootX] = rootY;
    } else if (this.#rank[rootX] > this.#rank[rootY]) {
      this.#parent[rootY] = rootX;
    } else {
      this.#parent[rootY] = rootX;
      this.#rank[rootX] += 1;
    }

    return true;
  }

  connected(a: number, b: number) {
    return this.find(a) === this.find(b);
  }
}
