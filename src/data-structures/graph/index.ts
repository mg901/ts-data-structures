export class Graph<T> {
  #adjacencyList = new Map<T, Set<T>>();

  addVertex(vertex: T) {
    if (!this.#adjacencyList.has(vertex)) {
      this.#adjacencyList.set(vertex, new Set());
    }
  }

  hasVertex(vertex: T) {
    return this.#adjacencyList.has(vertex);
  }

  deleteVertex(vertex: T) {
    if (!this.#adjacencyList.has(vertex)) return;

    this.#adjacencyList.delete(vertex);

    for (const neighbors of this.#adjacencyList.values()) {
      neighbors.delete(vertex);
    }
  }

  addEdge(from: T, to: T) {
    this.addVertex(from);
    this.addVertex(to);
    this.#adjacencyList.get(from)!.add(to);
  }

  hasEdge(from: T, to: T) {
    return this.#adjacencyList.get(from)!.has(to);
  }

  deleteEdge(from: T, to: T) {
    this.#adjacencyList.get(from)?.delete(to);
  }
}
