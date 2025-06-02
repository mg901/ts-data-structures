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

  describe('deleteVertex', () => {
    it('deletes vertex', () => {
      // Arrange
      graph.addEdge('A', 'B');
      graph.addEdge('C', 'B');

      // Act
      graph.deleteVertex('B');

      // Assert
      expect(graph.hasEdge('A', 'B')).toBeFalsy();
      expect(graph.hasEdge('C', 'B')).toBeFalsy();
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

  describe('deleteEdge', () => {
    it('deletes edge', () => {
      // Arrange
      graph.addEdge('A', 'B');

      // Act
      graph.deleteEdge('A', 'B');

      // Assert
      expect(graph.hasEdge('A', 'B'));
    });
  });
});
