import { beforeEach, describe, expect, it } from 'vitest';
import { Graph } from './index';

describe('Graph', () => {
  let graph: Graph<string>;

  beforeEach(() => {
    graph = new Graph();
  });

  describe('addVertex', () => {
    it('adds new vertex', () => {
      // Act
      graph.addVertex('A');

      // Assert
      expect(graph.hasVertex('A')).toBeTruthy();
    });
  });

  describe('addEdge', () => {
    it('adds an edge and vertices if missing', () => {
      // Act
      graph.addEdge('A', 'B');

      // Assert
      expect(graph.hasVertex('A')).toBeTruthy();
      expect(graph.hasVertex('B')).toBeTruthy();
      expect(graph.hasEdge('A', 'B')).toBeTruthy();
    });
  });
});
