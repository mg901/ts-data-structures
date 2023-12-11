import { describe, beforeEach, it, expect } from 'vitest';
import { DoublyLinkedList } from './doubly-linked-list';

describe('LRUCache/DoublyLinkedList', () => {
  let list: DoublyLinkedList<string, string>;

  // Arrange
  beforeEach(() => {
    list = new DoublyLinkedList<string, string>();
  });

  describe('push', () => {
    it('pushes a node to the list', () => {
      // Act
      const node = list.push('key1', 'value1');

      // Assert
      expect(list.head).toBe(node);
      expect(list.tail).toBe(node);
      expect(list.length).toBe(1);
    });

    it('pushes multiple nodes to the list', () => {
      // Act
      const node1 = list.push('key1', 'value1');
      const node2 = list.push('key2', 'value2');

      // Assert
      expect(list.head).toBe(node1);
      expect(list.tail).toBe(node2);
      expect(list.length).toBe(2);
      expect(node1.next).toBe(node2);
      expect(node2.prev).toBe(node1);
    });
  });

  describe('delete', () => {
    it('deletes the only node in the list', () => {
      // Arrange
      const node = list.push('key1', 'value1');

      // Act
      list.delete(node);

      // Assert
      expect(list.head).toBeNull();
      expect(list.tail).toBeNull();
      expect(list.length).toBe(0);
    });

    it('deletes the head node', () => {
      // Arrange
      const node1 = list.push('key1', 'value1');
      const node2 = list.push('key2', 'value2');

      // Act
      list.delete(node1);

      // Assert
      expect(list.head).toBe(node2);
      expect(list.tail).toBe(node2);
      expect(list.length).toBe(1);
      expect(node2.prev).toBeNull();
    });

    it('deletes the tail node', () => {
      // Arrange
      const node1 = list.push('key1', 'value1');
      const node2 = list.push('key2', 'value2');

      // Act
      list.delete(node2);

      // Assert
      expect(list.head).toBe(node1);
      expect(list.tail).toBe(node1);
      expect(list.length).toBe(1);
      expect(node1.next).toBeNull();
    });

    it('deletes a node from the middle of the list', () => {
      // Arrange
      const node1 = list.push('key1', 'value1');
      const node2 = list.push('key2', 'value2');
      const node3 = list.push('key3', 'value3');

      // Act
      list.delete(node2);

      // Assert
      expect(list.head).toBe(node1);
      expect(list.tail).toBe(node3);
      expect(list.length).toBe(2);
      expect(node1.next).toBe(node3);
      expect(node3.prev).toBe(node1);
    });
  });
});
