import { describe, beforeEach, it, expect } from 'vitest';
import { DoublyLinkedList } from './doubly-linked-list';

describe('DoublyLinkedList', () => {
  // @ts-ignore
  let doublyList = null as DoublyLinkedList<number>;

  // Arrange
  beforeEach(() => {
    doublyList = new DoublyLinkedList<number>();
  });

  it('returns the initial state correctly', () => {
    // Act and Assert
    expect(doublyList.head).toBeNull();
    expect(doublyList.tail).toBeNull();
    expect(doublyList.length).toBe(0);
  });

  describe('append', () => {
    it('appends node to the empty list', () => {
      // Act
      doublyList.append(1);

      // Assert
      expect(doublyList.head?.value).toBe(1);
      expect(doublyList.head?.prev).toBeNull();

      expect(doublyList.tail?.value).toBe(1);
      expect(doublyList.tail?.next).toBeNull();

      expect(doublyList.length).toBe(1);
    });

    it('appends nodes to the non-empty list', () => {
      // Act
      doublyList.append(1);
      doublyList.append(2);

      // Assert
      expect(doublyList.head?.value).toBe(1);
      expect(doublyList.head?.next?.value).toBe(2);
      expect(doublyList.head?.next?.prev?.value).toBe(1);

      expect(doublyList.tail?.value).toBe(2);
      expect(doublyList.tail?.next).toBeNull();

      expect(doublyList.toString()).toBe('1,2');
      expect(doublyList.length).toBe(2);
    });

    it('can be used in call chain', () => {
      // Act
      doublyList.append(1).append(2).append(3);

      // Assert
      expect(doublyList.toString()).toBe('1,2,3');
      expect(doublyList.length).toBe(3);
    });
  });

  describe('toArray', () => {
    it('returns an empty array for the empty list', () => {
      // Act
      const received = doublyList.toArray();

      // Assert
      expect(received).toEqual([]);
      expect(doublyList.head).toBeNull();
      expect(doublyList.tail).toBeNull();
      expect(doublyList.length).toBe(0);
    });
  });

  describe('toString', () => {
    it('returns an empty string for the empty list', () => {
      // Act and Assert
      expect(doublyList.toString()).toBe('');
    });
  });

  describe('prepend', () => {
    it('prepends a new node to the beginning of the empty list', () => {
      // Arrange
      doublyList.prepend(1);

      // Act and Assert
      expect(doublyList.head?.value).toBe(1);
      expect(doublyList.head?.next).toBeNull();
      expect(doublyList.head?.prev).toBeNull();

      expect(doublyList.tail?.value).toBe(1);
      expect(doublyList.tail?.next).toBeNull();
      expect(doublyList.head?.prev).toBeNull();

      expect(doublyList.length).toBe(1);
    });

    it('prepends a new node to the beginning of the non-empty list', () => {
      // Arrange
      doublyList.append(2);
      doublyList.prepend(1);

      // Act and Assert
      expect(doublyList.head?.value).toBe(1);
      expect(doublyList.head?.next?.value).toBe(2);
      expect(doublyList.head?.prev).toBeNull();

      expect(doublyList.tail?.value).toBe(2);
      expect(doublyList.tail?.next).toBeNull();
      expect(doublyList.tail?.prev?.value).toBe(1);

      expect(doublyList.toString()).toBe('1,2');
      expect(doublyList.length).toBe(2);
    });

    it('can be used in call chain ', () => {
      // Act
      doublyList.prepend(3).prepend(2).prepend(1);

      // Assert
      expect(doublyList.toString()).toBe('1,2,3');
      expect(doublyList.length).toBe(3);
    });
  });

  describe('delete', () => {
    it('returns null when deleting a non-existing node', () => {
      // Act
      const deletedNode = doublyList.delete(5);

      // Assert
      expect(deletedNode).toBeNull();
      expect(doublyList.head).toBeNull();
      expect(doublyList.tail).toBeNull();

      expect(doublyList.length).toBe(0);
    });

    it('deletes the element outside the list', () => {
      // Arrange
      doublyList.append(1).append(2);

      // Act
      const deletedNode = doublyList.delete(3);

      // Assert
      expect(deletedNode).toBeNull();
      expect(doublyList.head?.value).toBe(1);
      expect(doublyList.head?.prev).toBeNull();

      expect(doublyList.tail?.value).toBe(2);
      expect(doublyList.tail?.next).toBeNull();

      expect(doublyList.toString()).toBe('1,2');
      expect(doublyList.length).toBe(2);
    });

    it('deletes the node from the singular node list', () => {
      // Arrange
      doublyList.append(1);

      // Act
      const deletedNode = doublyList.delete(1);

      // Assert
      expect(deletedNode?.value).toBe(1);
      expect(doublyList.head).toBeNull();
      expect(doublyList.tail).toBeNull();

      expect(doublyList.length).toBe(0);
    });

    it('deletes the first node from the multi-node list', () => {
      // Arrange
      doublyList.append(1).append(2).append(3);

      // Act
      const deletedNode = doublyList.delete(1);

      // Assert
      expect(deletedNode?.value).toBe(1);

      expect(doublyList.head?.value).toBe(2);
      expect(doublyList.head?.next?.value).toBe(3);
      expect(doublyList.head?.prev).toBeNull();

      expect(doublyList.tail?.value).toBe(3);
      expect(doublyList.tail?.next).toBeNull();

      expect(doublyList.length).toBe(2);
      expect(doublyList.toString()).toBe('2,3');
    });

    it('deletes an element in the middle', () => {
      // Arrange
      doublyList.append(1).append(2).append(3).append(4);

      // Act
      const deletedNode = doublyList.delete(2);

      // Assert
      expect(deletedNode?.value).toBe(2);
      expect(doublyList.head?.next?.value).toBe(3);
      expect(doublyList.head?.next?.prev?.value).toBe(1);
      expect(doublyList.tail?.next).toBeNull();

      expect(doublyList.toString()).toBe('1,3,4');
      expect(doublyList.length).toBe(3);
    });

    it('deletes the last element', () => {
      // Arrange
      doublyList.append(1).append(2).append(3);

      // Act
      const deleteNode = doublyList.delete(3);

      // Assert
      expect(deleteNode?.value).toBe(3);
      expect(doublyList.head?.value).toBe(1);
      expect(doublyList.tail?.value).toBe(2);
      expect(doublyList.tail?.next).toBeNull();
      expect(doublyList.tail?.prev?.value).toBe(1);

      expect(doublyList.toString()).toBe('1,2');
      expect(doublyList.length).toBe(2);
    });
  });

  describe('reverse', () => {
    it('reverses the empty list', () => {
      // Act
      doublyList.reverse();

      // Assert
      expect(doublyList.head).toBeNull();
      expect(doublyList.tail).toBeNull();
      expect(doublyList.length).toBe(0);
    });

    it('reverses the head of the singular node list', () => {
      // Arrange
      doublyList.append(1);

      // Act
      doublyList.reverse();

      // Assert
      expect(doublyList.head?.value).toBe(1);
      expect(doublyList.head?.prev).toBeNull();

      expect(doublyList.tail?.value).toBe(1);
      expect(doublyList.tail?.next).toBeNull();

      expect(doublyList.toString()).toBe('1');
    });

    it('reverses the list', () => {
      // Arrange
      doublyList.append(1).append(2).append(3);

      // Act
      doublyList.reverse();

      // Assert
      expect(doublyList.head?.value).toBe(3);
      expect(doublyList.head?.next?.value).toBe(2);
      expect(doublyList.head?.prev).toBeNull();

      expect(doublyList.tail?.value).toBe(1);
      expect(doublyList.tail?.next).toBeNull();

      expect(doublyList.toString()).toBe('3,2,1');
      expect(doublyList.length).toBe(3);
    });

    it('can be used in a call chain', () => {
      // Arrange and Act
      doublyList.append(1).append(2).append(3).reverse().append(4);

      // Assert
      expect(doublyList.head?.value).toBe(3);
      expect(doublyList.tail?.value).toBe(4);

      expect(doublyList.toString()).toBe('3,2,1,4');
      expect(doublyList.length).toBe(4);
    });
  });

  describe('insertAt', () => {
    it('throws exception if index less than list length', () => {
      // Act
      const received = () => doublyList.insertAt(-1, 1);

      // Assert
      expect(received).toThrow(
        'Index should be greater than or equal to 0 and less than or equal to the list length.',
      );
    });

    it('throws exception if index greater than list length', () => {
      // Act
      const received = () => doublyList.insertAt(10, 1);

      // Assert
      expect(received).toThrow(
        'Index should be greater than or equal to 0 and less than or equal to the list length.',
      );
    });

    it('inserts at the beginning of the list', () => {
      // Arrange
      doublyList.append(1);

      // Act
      doublyList.insertAt(0, 0);

      // Assert
      expect(doublyList.head?.value).toBe(0);
      expect(doublyList.head?.next?.value).toBe(1);
      expect(doublyList.head?.prev).toBeNull();

      expect(doublyList.tail?.value).toBe(1);
      expect(doublyList.tail?.next).toBeNull();
      expect(doublyList.tail?.prev?.value).toBe(0);

      expect(doublyList.toString()).toBe('0,1');
      expect(doublyList.length).toBe(2);
    });

    it('inserts at the end of the list', () => {
      // Arrange
      doublyList.append(1);

      // Act
      doublyList.insertAt(1, 2);

      // Assert
      expect(doublyList.head?.value).toBe(1);
      expect(doublyList.head?.next?.value).toBe(2);
      expect(doublyList.head?.prev).toBeNull();

      expect(doublyList.tail?.value).toBe(2);
      expect(doublyList.tail?.next).toBeNull();
      expect(doublyList.tail?.prev?.value).toBe(1);

      expect(doublyList.toString()).toBe('1,2');
      expect(doublyList.length).toBe(2);
    });

    it('inserts in the middle of the list', () => {
      // Arrange
      doublyList.append(1).append(3).append(4);

      // Act
      doublyList.insertAt(1, 2);

      // Assert
      expect(doublyList.head?.value).toBe(1);

      expect(doublyList.head?.next?.value).toBe(2);
      expect(doublyList.head?.next?.next?.value).toBe(3);
      expect(doublyList.head?.next?.prev?.value).toBe(1);

      expect(doublyList.tail?.value).toBe(4);
      expect(doublyList.tail?.next).toBeNull();

      expect(doublyList.toString()).toBe('1,2,3,4');
      expect(doublyList.length).toBe(4);
    });

    it('can be used in a call chain', () => {
      // Act
      doublyList.insertAt(0, 1).insertAt(1, 2);

      // Assert
      expect(doublyList.head?.value).toBe(1);
      expect(doublyList.tail?.value).toBe(2);

      expect(doublyList.toString()).toBe('1,2');
      expect(doublyList.length).toBe(2);
    });
  });

  describe('deleteHead', () => {
    it('deletes the head from an empty list', () => {
      // Act
      const deletedHead = doublyList.deleteHead();

      // Assert
      expect(deletedHead).toBeNull();
      expect(doublyList.head).toBeNull();
      expect(doublyList.tail).toBeNull();
      expect(doublyList.length).toBe(0);
    });

    it('deletes the head from the list with multiple nodes', () => {
      // Arrange
      doublyList.append(1).append(2).append(3);

      // Act
      const deletedHead = doublyList.deleteHead();

      // Assert
      expect(deletedHead?.value).toBe(1);

      expect(doublyList.head?.value).toBe(2);
      expect(doublyList.head?.next?.value).toBe(3);
      expect(doublyList.head?.prev).toBeNull();

      expect(doublyList.tail?.value).toBe(3);
      expect(doublyList.tail?.next).toBeNull();

      expect(doublyList.toString()).toBe('2,3');
      expect(doublyList.length).toBe(2);
    });
  });

  describe('deleteTail', () => {
    it('deletes the tail from an empty list', () => {
      // Act
      const deletedTail = doublyList.deleteTail();

      // Assert
      expect(deletedTail).toBeNull();
      expect(doublyList.head).toBeNull();
      expect(doublyList.tail).toBeNull();
      expect(doublyList.length).toBe(0);
    });

    it('deletes the tail from the list with multiple nodes', () => {
      // Arrange
      doublyList.append(1).append(2).append(3);

      // Act
      const deletedTail = doublyList.deleteTail();

      // Assert
      expect(deletedTail?.value).toBe(3);

      expect(doublyList.head?.value).toBe(1);
      expect(doublyList.head?.next?.value).toBe(2);
      expect(doublyList.head?.prev).toBeNull();

      expect(doublyList.tail?.value).toBe(2);
      expect(doublyList.tail?.next).toBeNull();
      expect(doublyList.tail?.prev?.value).toBe(1);

      expect(doublyList.toString()).toBe('1,2');
      expect(doublyList.length).toBe(2);
    });
  });
});
