import { beforeEach, describe, expect, it } from 'vitest';
import { DoublyLinkedList } from './index';
import { DoublyLinkedListNode } from './node';

describe('DoublyLinkedList', () => {
  let doublyList: DoublyLinkedList<number>;

  // Arrange
  beforeEach(() => {
    doublyList = new DoublyLinkedList<number>();
  });

  it('returns the initial state correctly', () => {
    // Act and Assert

    expect(doublyList.isEmpty).toBeTruthy();
    expect(doublyList.toString()).toBe('');
  });

  describe('toString', () => {
    it('converts the list to the string', () => {
      // Arrange
      doublyList.fromArray([1, 2, 3]);

      // Act and Assert
      expect(doublyList.toString()).toBe('1,2,3');
    });

    it('converts to list to string with custom callback', () => {
      // Arrange
      type Payload = {
        key: string;
        value: number;
      };

      const list = new DoublyLinkedList<Payload>().fromArray([
        { key: 'one', value: 1 },
        { key: 'two', value: 2 },
      ]);

      // Act
      const received = list.toString((node) => `${node.value}`);

      // Assert
      expect(received).toBe('1,2');
    });
  });

  describe('append', () => {
    it('appends node to the empty list', () => {
      // Act
      doublyList.append(1);

      // Assert
      expect(doublyList.head?.data).toBe(1);
      expect(doublyList.head?.prev).toBeNull();

      expect(doublyList.tail?.data).toBe(1);
      expect(doublyList.tail?.next).toBeNull();

      expect(doublyList.size).toBe(1);
    });

    it('appends nodes to the non-empty list', () => {
      // Act
      doublyList.append(1);
      doublyList.append(2);

      // Assert
      expect(doublyList.head?.data).toBe(1);
      expect(doublyList.head?.next?.data).toBe(2);
      expect(doublyList.head?.next?.prev?.data).toBe(1);

      expect(doublyList.tail?.data).toBe(2);
      expect(doublyList.tail?.next).toBeNull();

      expect(doublyList.size).toBe(2);
    });

    it('can be used in call chain', () => {
      // Act
      doublyList.append(1).append(2);

      // Assert
      expect(doublyList.head?.data).toBe(1);
      expect(doublyList.head?.next?.data).toBe(2);
      expect(doublyList.head?.prev).toBeNull();

      expect(doublyList.head?.next?.next).toBeNull();
      expect(doublyList.head?.next?.prev?.data).toBe(1);

      expect(doublyList.size).toBe(2);
    });
  });

  describe('prepend', () => {
    it('prepends a new node to the beginning of the empty list', () => {
      // Arrange
      doublyList.prepend(1);

      // Act and Assert
      expect(doublyList.head?.data).toBe(1);
      expect(doublyList.head?.next).toBeNull();
      expect(doublyList.head?.prev).toBeNull();

      expect(doublyList.size).toBe(1);
    });

    it('prepends a new node to the beginning of the non-empty list', () => {
      // Arrange
      doublyList.append(2);
      doublyList.prepend(1);

      // Act and Assert
      expect(doublyList.head?.data).toBe(1);
      expect(doublyList.head?.next?.data).toBe(2);
      expect(doublyList.head?.prev).toBeNull();

      expect(doublyList.tail?.data).toBe(2);
      expect(doublyList.tail?.next).toBeNull();
      expect(doublyList.tail?.prev?.data).toBe(1);

      expect(doublyList.toString()).toBe('1,2');
      expect(doublyList.size).toBe(2);
    });

    it('can be used in call chain ', () => {
      // Act
      doublyList.prepend(2).prepend(1);

      // Assert
      expect(doublyList.toString()).toBe('1,2');
      expect(doublyList.size).toBe(2);
    });
  });

  describe('insertAt', () => {
    it('throws exception if index less than list length', () => {
      // Act
      const received = () => doublyList.insertAt(-1, 1);

      // Assert
      expect(received).toThrow(RangeError);
      expect(received).toThrow(
        'Index should be greater than or equal to 0 and less than or equal to the list length.',
      );
    });

    it('throws exception if index greater than list length', () => {
      // Act
      const received = () => doublyList.insertAt(10, 1);

      // Assert
      expect(received).toThrow(RangeError);
      expect(received).toThrow(
        'Index should be greater than or equal to 0 and less than or equal to the list length.',
      );
    });

    it('inserts at the beginning of the list', () => {
      // Arrange
      doublyList.append(2);

      // Act
      doublyList.insertAt(0, 1);

      // Assert
      expect(doublyList.head?.data).toBe(1);
      expect(doublyList.head?.next?.data).toBe(2);
      expect(doublyList.head?.prev).toBeNull();

      expect(doublyList.tail?.data).toBe(2);
      expect(doublyList.tail?.next).toBeNull();
      expect(doublyList.tail?.prev?.data).toBe(1);

      expect(doublyList.toString()).toBe('1,2');
      expect(doublyList.size).toBe(2);
    });

    it('inserts at the end of the list', () => {
      // Arrange
      doublyList.append(1);

      // Act
      doublyList.insertAt(1, 2);

      // Assert
      expect(doublyList.head?.data).toBe(1);
      expect(doublyList.head?.next?.data).toBe(2);
      expect(doublyList.head?.prev).toBeNull();

      expect(doublyList.tail?.data).toBe(2);
      expect(doublyList.tail?.next).toBeNull();
      expect(doublyList.tail?.prev?.data).toBe(1);

      expect(doublyList.toString()).toBe('1,2');
      expect(doublyList.size).toBe(2);
    });

    it('inserts in the middle of the list', () => {
      // Arrange
      doublyList.fromArray([1, 3]);

      // Act
      doublyList.insertAt(1, 2);

      // Assert
      expect(doublyList.head?.data).toBe(1);

      expect(doublyList.head?.next?.data).toBe(2);
      expect(doublyList.head?.next?.next?.data).toBe(3);
      expect(doublyList.head?.next?.prev?.data).toBe(1);

      expect(doublyList.tail?.data).toBe(3);
      expect(doublyList.tail?.next).toBeNull();

      expect(doublyList.toString()).toBe('1,2,3');
      expect(doublyList.size).toBe(3);
    });

    it('can be used in a call chain', () => {
      // Act
      doublyList.insertAt(0, 1).insertAt(1, 2);

      // Assert
      expect(doublyList.head?.data).toBe(1);
      expect(doublyList.tail?.data).toBe(2);

      expect(doublyList.toString()).toBe('1,2');
      expect(doublyList.size).toBe(2);
    });
  });

  describe('deleteByValue', () => {
    it('returns null when deleting a non-existing node', () => {
      // Act
      const deletedNode = doublyList.deleteByValue(5);

      // Assert
      expect(deletedNode).toBeNull();
      expect(doublyList.isEmpty).toBeTruthy();
    });

    it('deletes the node outside the list', () => {
      // Arrange
      doublyList.fromArray([1, 2]);

      // Act
      const deletedNode = doublyList.deleteByValue(3);

      // Assert
      expect(deletedNode).toBeNull();
      expect(doublyList.head?.data).toBe(1);
      expect(doublyList.head?.prev).toBeNull();

      expect(doublyList.tail?.data).toBe(2);
      expect(doublyList.tail?.next).toBeNull();

      expect(doublyList.toString()).toBe('1,2');
      expect(doublyList.size).toBe(2);
    });

    it('deletes the node from the singular node list', () => {
      // Arrange
      doublyList.append(1);

      // Act
      const deletedNode = doublyList.deleteByValue(1);

      // Assert
      expect(deletedNode?.data).toBe(1);
      expect(doublyList.isEmpty).toBeTruthy();
    });

    it('deletes the first node', () => {
      // Arrange
      doublyList.fromArray([1, 2]);

      // Act
      const deletedNode = doublyList.deleteByValue(1);

      // Assert
      expect(deletedNode?.data).toBe(1);
      expect(deletedNode?.next).toBeNull();

      expect(doublyList.head?.data).toBe(2);
      expect(doublyList.head?.next).toBeNull();
      expect(doublyList.head?.prev).toBeNull();

      expect(doublyList.tail?.data).toBe(2);
      expect(doublyList.tail?.next).toBeNull();

      expect(doublyList.toString()).toBe('2');
      expect(doublyList.size).toBe(1);
    });

    it('deletes the node in the middle', () => {
      // Arrange
      doublyList.fromArray([1, 2, 3]);

      // Act
      const deletedNode = doublyList.deleteByValue(2);

      // Assert
      expect(deletedNode?.data).toBe(2);
      expect(deletedNode?.next).toBeNull();
      expect(deletedNode?.prev).toBeNull();

      expect(doublyList.head?.data).toBe(1);
      expect(doublyList.head?.next?.data).toBe(3);

      expect(doublyList.tail?.next).toBeNull();
      expect(doublyList.tail?.prev?.data).toBe(1);

      expect(doublyList.toString()).toBe('1,3');
      expect(doublyList.size).toBe(2);
    });

    it('deletes the last node', () => {
      // Arrange
      doublyList.fromArray([1, 2]);

      // Act
      const deletedNode = doublyList.deleteByValue(2);

      // Assert
      expect(deletedNode?.data).toBe(2);
      expect(deletedNode?.prev).toBeNull();

      expect(doublyList.head?.data).toBe(1);
      expect(doublyList.head?.next).toBeNull();

      expect(doublyList.tail?.data).toBe(1);
      expect(doublyList.tail?.next).toBeNull();
      expect(doublyList.tail?.prev).toBeNull();

      expect(doublyList.toString()).toBe('1');
      expect(doublyList.size).toBe(1);
    });

    it('deletes the node with object value', () => {
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
      const deletedNode = list.deleteByValue({
        key: 'two',
        value: 2,
      });

      // Assert
      expect(deletedNode?.data.value).toBe(2);
      expect(deletedNode?.next).toBeNull();
      expect(deletedNode?.prev).toBeNull();

      expect(list.head?.data.value).toBe(1);
      expect(list.head?.next?.data.value).toBe(3);
      expect(list.head?.next?.prev?.data.value).toBe(1);

      expect(list.tail?.data.value).toBe(3);
      expect(list.tail?.next).toBeNull();
      expect(list.size).toBe(2);
    });
  });

  describe('deleteByRef', () => {
    // Arrange
    let nodeMap: Record<string, DoublyLinkedListNode>;

    beforeEach(() => {
      nodeMap = {};
    });

    it('deletes the node from a singular node list', () => {
      // Arrange
      nodeMap.one = doublyList.append(1).tail!;

      // Act
      doublyList.deleteByRef(nodeMap.one!);

      // Assert
      expect(doublyList.isEmpty).toBeTruthy();
    });

    it('deletes the first node', () => {
      // Arrange
      nodeMap.one = doublyList.append(1).tail!;
      nodeMap.two = doublyList.append(2).tail!;

      // Act
      doublyList.deleteByRef(nodeMap.one!);

      // Assert
      expect(doublyList.head?.data).toBe(2);
      expect(doublyList.head?.next).toBeNull();
      expect(doublyList.tail?.data).toBe(2);
      expect(doublyList.tail?.prev).toBeNull();
      expect(doublyList.size).toBe(1);
    });

    it('deletes the last element', () => {
      // Arrange
      nodeMap.one = doublyList.append(1).tail!;
      nodeMap.two = doublyList.append(2).tail!;

      // Act
      doublyList.deleteByRef(nodeMap.two!);

      // Assert
      expect(doublyList.head?.data).toBe(1);
      expect(doublyList.head?.next).toBeNull();

      expect(doublyList.tail?.data).toBe(1);
      expect(doublyList.tail?.prev).toBeNull();
      expect(doublyList.size).toBe(1);
    });

    it('deletes the node at the middle', () => {
      // Arrange
      nodeMap.one = doublyList.append(1).tail!;
      nodeMap.two = doublyList.append(2).tail!;
      nodeMap.three = doublyList.append(3).tail!;

      // Act
      doublyList.deleteByRef(nodeMap.two);

      // Assert
      expect(doublyList.head?.data).toBe(1);
      expect(doublyList.head?.next?.data).toBe(3);

      expect(doublyList.tail?.data).toBe(3);
      expect(doublyList.tail?.prev?.data).toBe(1);
      expect(doublyList.size).toBe(2);
    });
  });

  describe('deleteHead', () => {
    it('deletes the head from an empty list', () => {
      // Act
      const deletedHead = doublyList.deleteHead();

      // Assert
      expect(deletedHead).toBeNull();
      expect(doublyList.isEmpty).toBeTruthy();
    });

    it('deletes the head from the singular node list', () => {
      // Arrange
      doublyList.append(1);

      // Act
      const deletedHead = doublyList.deleteHead();

      // Assert
      expect(deletedHead?.data).toBe(1);
      expect(doublyList.isEmpty).toBeTruthy();
    });

    it('removes the head from the multi-node list', () => {
      // Arrange
      doublyList.fromArray([1, 2]);

      // Act
      const deletedHead = doublyList.deleteHead();

      // Assert
      expect(deletedHead?.data).toBe(1);
      expect(deletedHead?.next).toBeNull();

      expect(doublyList.tail?.data).toBe(2);
      expect(doublyList.tail?.next).toBeNull();
      expect(doublyList.tail?.prev).toBeNull();
      expect(doublyList.size).toBe(1);
    });
  });

  describe('deleteTail', () => {
    it('deletes the tail from an empty list', () => {
      // Act
      const deletedTail = doublyList.deleteTail();

      // Assert
      expect(deletedTail).toBeNull();
      expect(doublyList.isEmpty).toBeTruthy();
    });

    it('deletes the tail form the list with a single node', () => {
      // Arrange
      doublyList.append(1);

      // Act
      const deletedTail = doublyList.deleteTail();

      // Assert
      expect(deletedTail?.data).toBe(1);
      expect(doublyList.isEmpty).toBeTruthy();
    });

    it('deletes the tail from the list with multiple nodes', () => {
      // Arrange
      doublyList.fromArray([1, 2]);

      // Act
      const deletedTail = doublyList.deleteTail();

      // Assert
      expect(deletedTail?.data).toBe(2);
      expect(deletedTail?.prev).toBeNull();

      expect(doublyList.tail?.data).toBe(1);
      expect(doublyList.tail?.next).toBeNull();
      expect(doublyList.tail?.prev).toBeNull();
      expect(doublyList.size).toBe(1);
    });
  });

  describe('reverse', () => {
    it('reverses an empty list', () => {
      // Act
      doublyList.reverse();

      // Assert
      expect(doublyList.isEmpty).toBeTruthy();
    });

    it('reverses the head of the singular node list', () => {
      // Arrange
      doublyList.append(1);

      // Act
      doublyList.reverse();

      // Assert
      expect(doublyList.head?.data).toBe(1);
      expect(doublyList.head?.prev).toBeNull();

      expect(doublyList.tail?.data).toBe(1);
      expect(doublyList.tail?.next).toBeNull();

      expect(doublyList.toString()).toBe('1');
    });

    it('reverses the list', () => {
      // Arrange
      doublyList.fromArray([1, 2]);

      // Act
      doublyList.reverse();

      // Assert
      expect(doublyList.head?.data).toBe(2);
      expect(doublyList.head?.next?.data).toBe(1);
      expect(doublyList.head?.prev).toBeNull();

      expect(doublyList.tail?.data).toBe(1);
      expect(doublyList.tail?.next).toBeNull();

      expect(doublyList.toString()).toBe('2,1');
      expect(doublyList.size).toBe(2);
    });

    it('can be used in a call chain', () => {
      // Arrange and Act
      doublyList.fromArray([2, 1]).reverse().append(3);

      // Assert
      expect(doublyList.head?.data).toBe(1);
      expect(doublyList.tail?.data).toBe(3);

      expect(doublyList.toString()).toBe('1,2,3');
      expect(doublyList.size).toBe(3);
    });
  });

  describe('toStringTag', () => {
    it('returns correct string representation', () => {
      // Assert
      expect(Object.prototype.toString.call(new DoublyLinkedList())).toBe(
        '[object DoublyLinkedList]',
      );
    });
  });
});
