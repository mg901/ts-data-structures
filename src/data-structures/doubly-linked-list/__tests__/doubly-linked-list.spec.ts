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

  describe('isEmpty', () => {
    it('works correctly', () => {
      // Arrange
      expect(doublyLinkedList.isEmpty).toBeTruthy();
      doublyLinkedList.append(1);

      // Act and Assert
      expect(doublyLinkedList.isEmpty).toBeFalsy();
    });
  });

  describe('toString', () => {
    it('converts a list to string', () => {
      doublyLinkedList.append(1).append(2);

      expect(doublyLinkedList.toString()).toBe('1,2');
    });
    it('converts a list to string with custom callback', () => {
      // Arrange
      type NodeValue = {
        key: string;
        value: number;
      };

      const list = new DoublyLinkedList<NodeValue>();

      list
        .append({
          key: 'one',
          value: 1,
        })
        .append({
          key: 'two',
          value: 2,
        });

      // Act
      const received = list.toString((node) => `${node.value}`);

      // Assert
      expect(received).toBe('1,2');
    });
  });

  describe('fromArray', () => {
    it('creates an empty list when an empty array is passed', () => {
      // Act
      doublyLinkedList.fromArray([]);

      // Assert
      expect(doublyLinkedList.head).toBeNull();
      expect(doublyLinkedList.tail).toBeNull();
      expect(doublyLinkedList.size).toBe(0);
    });

    it('creates a list with the same nodes as the input array', () => {
      // Act
      doublyLinkedList.fromArray([1, 2]);

      // Assert
      expect(doublyLinkedList.toString()).toBe('1,2');
    });
  });

  describe('Iterator', () => {
    it('handles an empty list', () => {
      // Act
      const received = Array.from(doublyLinkedList);

      // Assert
      expect(received).toEqual([]);
    });
    it('iterates through the elements of the list', () => {
      // Arrange
      const expected = [1, 2, 3];

      doublyLinkedList.fromArray(expected);

      // Act
      const received = Array.from(doublyLinkedList, (node) => node.data);

      // Assert
      expect(received).toEqual(expected);
    });
  });

  describe('toArray', () => {
    it('converts an empty list to an array', () => {
      // Act
      const received = doublyLinkedList.toArray();

      // Assert
      expect(received).toEqual([]);
      expect(doublyLinkedList.head).toBeNull();
      expect(doublyLinkedList.tail).toBeNull();
      expect(doublyLinkedList.size).toBe(0);
    });

    it('converts a list to an array', () => {
      // Arrange
      const expected = [1, 2];
      doublyLinkedList.fromArray(expected);

      // Act
      const received = doublyLinkedList.toArray();

      // Assert
      expect(received).toEqual(expected);
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

  describe('indexOf', () => {
    it('returns -1 for an empty list', () => {
      // Act and Assert
      expect(doublyLinkedList.indexOf(42)).toBe(-1);
    });

    beforeEach(() => {
      // Arrange
      doublyLinkedList.fromArray([1, 2, 3, 3, 4]);
    });

    it('returns -1 for a value not present in the list', () => {
      // Act and Assert
      expect(doublyLinkedList.indexOf(42)).toBe(-1);
    });

    it('returns the correct index for a value present in the list', () => {
      // Act and Assert
      expect(doublyLinkedList.indexOf(2)).toBe(1);
    });

    it('returns the index of the first occurrence of the value', () => {
      // Act and Assert
      expect(doublyLinkedList.indexOf(3)).toBe(2);
    });

    it('returns the correct index for the head value', () => {
      // Act and Assert
      expect(doublyLinkedList.indexOf(1)).toBe(0);
    });

    it('returns the correct index for the tail value', () => {
      // Act and Assert
      expect(doublyLinkedList.indexOf(4)).toBe(4);
    });

    it('handles custom objects and comparison correctly', () => {
      type Item = {
        key: string;
      };
      // Arrange
      const list = new DoublyLinkedList<Item>().fromArray([
        { key: 'value1' },
        { key: 'value2' },
      ]);

      // Act and Assert
      expect(list.indexOf({ key: 'value1' })).toBe(0);
    });
  });

  describe('find', () => {
    it('returns null for a not-found node', () => {
      // Act and Assert
      expect(doublyLinkedList.find(1)).toBeNull();
      expect(doublyLinkedList.find((value) => value === 100)).toBeNull();
    });

    it('finds a node by value', () => {
      // Arrange
      doublyLinkedList.fromArray([1, 2]);

      // Act
      const foundedNode = doublyLinkedList.find(2);

      // Assert
      expect(foundedNode?.data).toBe(2);
    });

    it('finds a node by predicate', () => {
      // Arrange
      doublyLinkedList.fromArray([1, 2, 3]);

      // Act
      const foundedNode = doublyLinkedList.find((value) => value > 2);

      // Assert
      expect(foundedNode?.data).toBe(3);
    });

    it('prioritizes predicate over value', () => {
      // Arrange
      doublyLinkedList.fromArray([1, 2]);

      // Act
      const foundedNode = doublyLinkedList.find((value) => value > 1);

      // Assert
      expect(foundedNode?.data).toBe(2);
    });

    it('returns the first node if multiple nodes match the predicate', () => {
      // Arrange
      doublyLinkedList.fromArray([1, 2, 3, 4]);

      // Act
      const foundedNode = doublyLinkedList.find((value) => value > 1);

      // Assert
      expect(foundedNode?.data).toBe(2);
    });
  });

  describe('clear', () => {
    it('removes all nodes from the linked list', () => {
      // Arrange
      doublyLinkedList.fromArray([1, 2, 3]);

      // Act
      doublyLinkedList.clear();

      // Assert
      expect(doublyLinkedList.head).toBeNull();
      expect(doublyLinkedList.tail).toBeNull();
      expect(doublyLinkedList.size).toBe(0);
      expect(doublyLinkedList.isEmpty).toBeTruthy();
    });
  });
});
