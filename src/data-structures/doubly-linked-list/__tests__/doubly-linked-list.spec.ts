import { beforeEach, describe, expect, it } from 'vitest';
import { DoublyLinkedList } from '../doubly-linked-list';

describe('DoublyLinkedList', () => {
  let doublyLinkedList: DoublyLinkedList<number>;

  // Arrange
  beforeEach(() => {
    doublyLinkedList = new DoublyLinkedList<number>();
  });

  it('returns the initial state correctly', () => {
    // Act and Assert
    expect(doublyLinkedList.head).toBeNull();
    expect(doublyLinkedList.tail).toBeNull();
    expect(doublyLinkedList.size).toBe(0);
    expect(doublyLinkedList.toString()).toBe('');
    expect(doublyLinkedList.isEmpty).toBeTruthy();
  });

  describe('append', () => {
    it('appends node to the empty list', () => {
      // Act
      doublyLinkedList.append(1);

      // Assert
      expect(doublyLinkedList.head?.data).toBe(1);
      expect(doublyLinkedList.head?.prev).toBeNull();

      expect(doublyLinkedList.tail?.data).toBe(1);
      expect(doublyLinkedList.tail?.next).toBeNull();

      expect(doublyLinkedList.size).toBe(1);
    });

    it('appends nodes to the non-empty list', () => {
      // Act
      doublyLinkedList.append(1);
      doublyLinkedList.append(2);

      // Assert
      expect(doublyLinkedList.head?.data).toBe(1);
      expect(doublyLinkedList.head?.next?.data).toBe(2);
      expect(doublyLinkedList.head?.next?.prev?.data).toBe(1);

      expect(doublyLinkedList.tail?.data).toBe(2);
      expect(doublyLinkedList.tail?.next).toBeNull();

      expect(doublyLinkedList.size).toBe(2);
    });

    it('can be used in call chain', () => {
      // Act
      doublyLinkedList.append(1).append(2);

      // Assert
      expect(doublyLinkedList.head?.data).toBe(1);
      expect(doublyLinkedList.head?.next?.data).toBe(2);
      expect(doublyLinkedList.head?.prev).toBeNull();

      expect(doublyLinkedList.head?.next?.next).toBeNull();
      expect(doublyLinkedList.head?.next?.prev?.data).toBe(1);

      expect(doublyLinkedList.size).toBe(2);
    });
  });

  describe('prepend', () => {
    it('prepends a new node to the beginning of the empty list', () => {
      // Arrange
      doublyLinkedList.prepend(1);

      // Act and Assert
      expect(doublyLinkedList.head?.data).toBe(1);
      expect(doublyLinkedList.head?.next).toBeNull();
      expect(doublyLinkedList.head?.prev).toBeNull();

      expect(doublyLinkedList.size).toBe(1);
    });

    it('prepends a new node to the beginning of the non-empty list', () => {
      // Arrange
      doublyLinkedList.append(2);
      doublyLinkedList.prepend(1);

      // Act and Assert
      expect(doublyLinkedList.head?.data).toBe(1);
      expect(doublyLinkedList.head?.next?.data).toBe(2);
      expect(doublyLinkedList.head?.prev).toBeNull();

      expect(doublyLinkedList.tail?.data).toBe(2);
      expect(doublyLinkedList.tail?.next).toBeNull();
      expect(doublyLinkedList.tail?.prev?.data).toBe(1);

      expect(doublyLinkedList.toString()).toBe('1,2');
      expect(doublyLinkedList.size).toBe(2);
    });

    it('can be used in call chain ', () => {
      // Act
      doublyLinkedList.prepend(2).prepend(1);

      // Assert
      expect(doublyLinkedList.toString()).toBe('1,2');
      expect(doublyLinkedList.size).toBe(2);
    });
  });

  describe('delete', () => {
    it('returns null when deleting a non-existing node', () => {
      // Act
      const deletedNode = doublyLinkedList.delete(5);

      // Assert
      expect(deletedNode).toBeNull();
      expect(doublyLinkedList.head).toBeNull();
      expect(doublyLinkedList.tail).toBeNull();

      expect(doublyLinkedList.size).toBe(0);
    });

    it('deletes the element outside the list', () => {
      // Arrange
      doublyLinkedList.fromArray([1, 2]);

      // Act
      const deletedNode = doublyLinkedList.delete(3);

      // Assert
      expect(deletedNode).toBeNull();
      expect(doublyLinkedList.head?.data).toBe(1);
      expect(doublyLinkedList.head?.prev).toBeNull();

      expect(doublyLinkedList.tail?.data).toBe(2);
      expect(doublyLinkedList.tail?.next).toBeNull();

      expect(doublyLinkedList.toString()).toBe('1,2');
      expect(doublyLinkedList.size).toBe(2);
    });

    it('deletes the node from the singular node list', () => {
      // Arrange
      doublyLinkedList.append(1);

      // Act
      const deletedNode = doublyLinkedList.delete(1);

      // Assert
      expect(deletedNode?.data).toBe(1);
      expect(doublyLinkedList.head).toBeNull();
      expect(doublyLinkedList.tail).toBeNull();

      expect(doublyLinkedList.size).toBe(0);
    });

    it('deletes the first element', () => {
      // Arrange
      doublyLinkedList.fromArray([1, 2]);

      // Act
      const deletedNode = doublyLinkedList.delete(1);

      // Assert
      expect(deletedNode?.data).toBe(1);

      expect(doublyLinkedList.head?.data).toBe(2);
      expect(doublyLinkedList.head?.next).toBeNull();
      expect(doublyLinkedList.head?.prev).toBeNull();

      expect(doublyLinkedList.tail?.data).toBe(2);
      expect(doublyLinkedList.tail?.next).toBeNull();

      expect(doublyLinkedList.toString()).toBe('2');
      expect(doublyLinkedList.size).toBe(1);
    });

    it('deletes an element in the middle', () => {
      // Arrange
      doublyLinkedList.fromArray([1, 2, 3]);

      // Act
      const deletedNode = doublyLinkedList.delete(2);

      // Assert
      expect(deletedNode?.data).toBe(2);

      expect(doublyLinkedList.head?.data).toBe(1);
      expect(doublyLinkedList.head?.next?.data).toBe(3);

      expect(doublyLinkedList.tail?.next).toBeNull();
      expect(doublyLinkedList.tail?.prev?.data).toBe(1);

      expect(doublyLinkedList.toString()).toBe('1,3');
      expect(doublyLinkedList.size).toBe(2);
    });

    it('deletes the last element', () => {
      // Arrange
      doublyLinkedList.fromArray([1, 2]);

      // Act
      const deleteNode = doublyLinkedList.delete(2);

      // Assert
      expect(deleteNode?.data).toBe(2);

      expect(doublyLinkedList.head?.data).toBe(1);
      expect(doublyLinkedList.head?.next).toBeNull();

      expect(doublyLinkedList.tail?.data).toBe(1);
      expect(doublyLinkedList.tail?.next).toBeNull();
      expect(doublyLinkedList.tail?.prev).toBeNull();

      expect(doublyLinkedList.toString()).toBe('1');
      expect(doublyLinkedList.size).toBe(1);
    });

    it('deletes node with object value', () => {
      // Arrange
      type Value = {
        key: string;
        value: number;
      };

      const list = new DoublyLinkedList<Value>().fromArray([
        { key: 'one', value: 1 },
        { key: 'two', value: 2 },
        { key: 'three', value: 3 },
      ]);

      // Act
      const deletedNode = list.delete({
        key: 'two',
        value: 2,
      });

      // Assert
      expect(deletedNode?.data.value).toBe(2);

      expect(list.head?.data.value).toBe(1);
      expect(list.head?.next?.data.value).toBe(3);
      expect(list.head?.next?.prev?.data.value).toBe(1);

      expect(list.tail?.data.value).toBe(3);
      expect(list.tail?.next).toBeNull();
      expect(list.size).toBe(2);
    });
  });

  describe('reverse', () => {
    it('reverses an empty list', () => {
      // Act
      doublyLinkedList.reverse();

      // Assert
      expect(doublyLinkedList.head).toBeNull();
      expect(doublyLinkedList.tail).toBeNull();
      expect(doublyLinkedList.size).toBe(0);
    });

    it('reverses the head of the singular node list', () => {
      // Arrange
      doublyLinkedList.append(1);

      // Act
      doublyLinkedList.reverse();

      // Assert
      expect(doublyLinkedList.head?.data).toBe(1);
      expect(doublyLinkedList.head?.prev).toBeNull();

      expect(doublyLinkedList.tail?.data).toBe(1);
      expect(doublyLinkedList.tail?.next).toBeNull();

      expect(doublyLinkedList.toString()).toBe('1');
    });

    it('reverses the list', () => {
      // Arrange
      doublyLinkedList.fromArray([1, 2]);

      // Act
      doublyLinkedList.reverse();

      // Assert
      expect(doublyLinkedList.head?.data).toBe(2);
      expect(doublyLinkedList.head?.next?.data).toBe(1);
      expect(doublyLinkedList.head?.prev).toBeNull();

      expect(doublyLinkedList.tail?.data).toBe(1);
      expect(doublyLinkedList.tail?.next).toBeNull();

      expect(doublyLinkedList.toString()).toBe('2,1');
      expect(doublyLinkedList.size).toBe(2);
    });

    it('can be used in a call chain', () => {
      // Arrange and Act
      doublyLinkedList.fromArray([2, 1]).reverse().append(3);

      // Assert
      expect(doublyLinkedList.head?.data).toBe(1);
      expect(doublyLinkedList.tail?.data).toBe(3);

      expect(doublyLinkedList.toString()).toBe('1,2,3');
      expect(doublyLinkedList.size).toBe(3);
    });
  });

  describe('insertAt', () => {
    it('throws exception if index less than list length', () => {
      // Act
      const received = () => doublyLinkedList.insertAt(-1, 1);

      // Assert
      expect(received).toThrow(
        'Index should be greater than or equal to 0 and less than or equal to the list length.',
      );
    });

    it('throws exception if index greater than list length', () => {
      // Act
      const received = () => doublyLinkedList.insertAt(10, 1);

      // Assert
      expect(received).toThrow(
        'Index should be greater than or equal to 0 and less than or equal to the list length.',
      );
    });

    it('inserts at the beginning of the list', () => {
      // Arrange
      doublyLinkedList.append(2);

      // Act
      doublyLinkedList.insertAt(0, 1);

      // Assert
      expect(doublyLinkedList.head?.data).toBe(1);
      expect(doublyLinkedList.head?.next?.data).toBe(2);
      expect(doublyLinkedList.head?.prev).toBeNull();

      expect(doublyLinkedList.tail?.data).toBe(2);
      expect(doublyLinkedList.tail?.next).toBeNull();
      expect(doublyLinkedList.tail?.prev?.data).toBe(1);

      expect(doublyLinkedList.toString()).toBe('1,2');
      expect(doublyLinkedList.size).toBe(2);
    });

    it('inserts at the end of the list', () => {
      // Arrange
      doublyLinkedList.append(1);

      // Act
      doublyLinkedList.insertAt(1, 2);

      // Assert
      expect(doublyLinkedList.head?.data).toBe(1);
      expect(doublyLinkedList.head?.next?.data).toBe(2);
      expect(doublyLinkedList.head?.prev).toBeNull();

      expect(doublyLinkedList.tail?.data).toBe(2);
      expect(doublyLinkedList.tail?.next).toBeNull();
      expect(doublyLinkedList.tail?.prev?.data).toBe(1);

      expect(doublyLinkedList.toString()).toBe('1,2');
      expect(doublyLinkedList.size).toBe(2);
    });

    it('inserts in the middle of the list', () => {
      // Arrange
      doublyLinkedList.fromArray([1, 3]);

      // Act
      doublyLinkedList.insertAt(1, 2);

      // Assert
      expect(doublyLinkedList.head?.data).toBe(1);

      expect(doublyLinkedList.head?.next?.data).toBe(2);
      expect(doublyLinkedList.head?.next?.next?.data).toBe(3);
      expect(doublyLinkedList.head?.next?.prev?.data).toBe(1);

      expect(doublyLinkedList.tail?.data).toBe(3);
      expect(doublyLinkedList.tail?.next).toBeNull();

      expect(doublyLinkedList.toString()).toBe('1,2,3');
      expect(doublyLinkedList.size).toBe(3);
    });

    it('can be used in a call chain', () => {
      // Act
      doublyLinkedList.insertAt(0, 1).insertAt(1, 2);

      // Assert
      expect(doublyLinkedList.head?.data).toBe(1);
      expect(doublyLinkedList.tail?.data).toBe(2);

      expect(doublyLinkedList.toString()).toBe('1,2');
      expect(doublyLinkedList.size).toBe(2);
    });
  });

  describe('deleteHead', () => {
    it('deletes the head from an empty list', () => {
      // Act
      const deletedHead = doublyLinkedList.deleteHead();

      // Assert
      expect(deletedHead).toBeNull();
      expect(doublyLinkedList.size).toBe(0);
    });

    it('deletes the head from the singular node list', () => {
      // Arrange
      doublyLinkedList.append(1);

      // Act
      const deletedHead = doublyLinkedList.deleteHead();

      // Assert
      expect(deletedHead?.data).toBe(1);

      expect(doublyLinkedList.head).toBeNull();
      expect(doublyLinkedList.tail).toBeNull();
      expect(doublyLinkedList.size).toBe(0);
    });

    it('removes the head from the multi-node list', () => {
      // Arrange
      doublyLinkedList.fromArray([1, 2]);

      // Act and Assert
      expect(doublyLinkedList.deleteHead()?.data).toBe(1);

      expect(doublyLinkedList.tail?.data).toBe(2);
      expect(doublyLinkedList.tail?.next).toBeNull();
      expect(doublyLinkedList.tail?.prev).toBeNull();
      expect(doublyLinkedList.size).toBe(1);
    });
  });

  describe('deleteTail', () => {
    it('deletes the tail from an empty list', () => {
      // Act
      const deletedTail = doublyLinkedList.deleteTail();

      // Assert
      expect(deletedTail).toBeNull();
      expect(doublyLinkedList.size).toBe(0);
    });

    it('deletes the tail form the list with a single node', () => {
      // Arrange
      doublyLinkedList.append(1);

      // Act
      const deletedTail = doublyLinkedList.deleteTail();

      // Assert
      expect(deletedTail?.data).toBe(1);
      expect(doublyLinkedList.head).toBeNull();
      expect(doublyLinkedList.tail).toBeNull();
      expect(doublyLinkedList.size).toBe(0);
    });

    it('deletes the tail from the list with multiple nodes', () => {
      // Arrange
      doublyLinkedList.fromArray([1, 2]);

      // Act
      const deletedTail = doublyLinkedList.deleteTail();

      // Assert
      expect(deletedTail?.data).toBe(2);

      expect(doublyLinkedList.tail?.data).toBe(1);
      expect(doublyLinkedList.tail?.next).toBeNull();
      expect(doublyLinkedList.tail?.prev).toBeNull();
      expect(doublyLinkedList.size).toBe(1);
    });
  });
});
