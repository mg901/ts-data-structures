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

  addEdge(from: T, to: T) {
    this.addVertex(from);
    this.addVertex(to);
    this.#adjacencyList.get(from)!.add(to);
  }

  hasEdge(from: T, to: T) {
    return this.#adjacencyList.get(from)!.has(to);
  }
}
