import { describe, beforeEach, it, expect } from 'vitest';
import { DoublyLinkedList } from './doubly-linked-list';

describe('DoublyLinkedList', () => {
  // @ts-ignore
  let list = null as DoublyLinkedList<number>;

  // Arrange
  beforeEach(() => {
    list = new DoublyLinkedList<number>();
  });

  it('returns the initial state correctly', () => {
    // Act and Assert
    expect(list.head).toBeNull();
    expect(list.tail).toBeNull();
    expect(list.length).toBe(0);
  });

  describe('append', () => {
    it('appends node to the empty list', () => {
      // Arrange
      list.append(1);

      // Act and Assert
      expect(list.head?.value).toBe(1);
      expect(list.tail?.value).toBe(1);
      expect(list.length).toBe(1);
    });

    it('appends nodes to the non-empty list', () => {
      // Arrange
      list.append(1);
      list.append(2);

      // Act and Assert
      expect(list.head?.value).toBe(1);
      expect(list.head?.next?.value).toBe(2);
      expect(list.head?.next?.prev?.value).toBe(1);

      expect(list.tail?.value).toBe(2);
      expect(list.tail?.next).toBeNull();
      expect(list.length).toBe(2);
    });

    it('can be used in call chain', () => {
      // Arrange
      list.append(1).append(2).append(3);

      // Act and Assert
      expect(list.toString).toBe('1,2,3');
      expect(list.length).toBe(3);
    });
  });

  describe('toArray', () => {
    it('returns an empty array for the empty list', () => {
      // Act and Assert
      expect(list.toArray()).toEqual([]);
      expect(list.head).toBeNull();
      expect(list.tail).toBeNull();
      expect(list.length).toBe(0);
    });
  });

  describe('toString', () => {
    it('returns an empty string for the empty list', () => {
      // Act and Assert
      expect(list.toString()).toBe('');
    });
  });

  describe('prepend', () => {
    it('prepends a new node to the beginning of the empty list', () => {
      // Arrange
      list.prepend(1);

      // Act and Assert
      expect(list.head?.value).toBe(1);
      expect(list.head?.next).toBeNull();
      expect(list.head?.prev).toBeNull();

      expect(list.tail?.value).toBe(1);
      expect(list.tail?.next).toBeNull();
      expect(list.head?.prev).toBeNull();

      expect(list.length).toBe(1);
    });

    it('prepends a new node to the beginning of the non-empty list', () => {
      // Arrange
      list.append(2);
      list.prepend(1);

      // Act and Assert
      expect(list.head?.value).toBe(1);
      expect(list.head?.next?.value).toBe(2);
      expect(list.head?.prev).toBeNull();

      expect(list.tail?.value).toBe(2);
      expect(list.tail?.next).toBeNull();
      expect(list.tail?.prev?.value).toBe(1);

      expect(list.length).toBe(2);
    });

    it('can be used in call chain ', () => {
      // Arrange
      list.prepend(3).prepend(2).prepend(1);

      // Act and Assert
      expect(list.toString()).toBe('1,2,3');
      expect(list.length).toBe(3);
    });
  });
});
