/* eslint-disable no-restricted-syntax */
import { beforeEach, describe, expect, it } from 'vitest';
import { LinkedList } from '../linked-list';

describe('LinkedList', () => {
  let linkedList: LinkedList<number>;

  // Arrange
  beforeEach(() => {
    linkedList = new LinkedList();
  });

  it('returns the initial state of the list correctly', () => {
    // Assert
    expect(linkedList.head).toBeNull();
    expect(linkedList.tail).toBeNull();
    expect(linkedList.size).toBe(0);
  });

  describe('append', () => {
    it('appends node to the empty list', () => {
      // Act
      linkedList.append(1);

      // Assert
      expect(linkedList.head?.data).toBe(1);
      expect(linkedList.head?.next).toBeNull();

      expect(linkedList.tail?.data).toBe(1);
      expect(linkedList.tail?.next).toBeNull();

      expect(linkedList.size).toBe(1);
    });

    it('appends nodes to the non-empty list', () => {
      // Arrange
      linkedList.append(1);

      // Act
      linkedList.append(2);

      // Assert
      expect(linkedList.head?.data).toBe(1);
      expect(linkedList.head?.next?.data).toBe(2);

      expect(linkedList.tail?.data).toBe(2);
      expect(linkedList.tail?.next).toBeNull();
      expect(linkedList.size).toBe(2);
    });

    it('can be used in a call chain', () => {
      // Act
      linkedList.append(1).append(2).append(3);

      // Assert
      expect(linkedList.head?.data).toBe(1);
      expect(linkedList.head?.next?.data).toBe(2);
      expect(linkedList.head?.next?.next?.data).toBe(3);

      expect(linkedList.tail?.data).toBe(3);
      expect(linkedList.tail?.next).toBeNull();
      expect(linkedList.size).toBe(3);
    });
  });

  describe('isEmpty', () => {
    it('works correctly', () => {
      // Assert
      expect(linkedList.isEmpty).toBeTruthy();

      linkedList.append(1);

      // Act and Assert
      expect(linkedList.isEmpty).toBeFalsy();
    });

    it('return false for the non-empty list', () => {});
  });

  describe('toString', () => {
    it('converts the list to the string', () => {
      // Arrange
      linkedList.fromArray([1, 2, 3]);

      // Act and Assert
      expect(linkedList.toString()).toBe('1,2,3');
    });

    it('converts to list to string with custom callback', () => {
      // Arrange
      type NodeValue = {
        key: string;
        value: number;
      };

      const list = new LinkedList<NodeValue>().fromArray([
        { key: 'one', value: 1 },
        { key: 'two', value: 2 },
      ]);

      // Act
      const received = list.toString((node) => `${node.value}`);

      // Assert
      expect(received).toBe('1,2');
    });
  });

  describe('fromArray', () => {
    it('creates an empty list when an empty array is passed', () => {
      // Act
      linkedList.fromArray([]);

      // Assert
      expect(linkedList.isEmpty).toBeTruthy();
    });

    it('creates a list with the same nodes as the input array', () => {
      // Act
      linkedList.fromArray([1, 2, 3]);

      // Assert
      expect(linkedList.head?.data).toBe(1);
      expect(linkedList.head?.next?.data).toBe(2);
      expect(linkedList.head?.next?.next?.data).toBe(3);

      expect(linkedList.tail?.data).toBe(3);
      expect(linkedList.tail?.next).toBeNull();

      expect(linkedList.toString()).toBe('1,2,3');
      expect(linkedList.size).toBe(3);
    });
  });

  describe('Iterator', () => {
    it('iterates through the elements of the list', () => {
      // Arrange
      const expectedArray = [1, 2, 3];
      linkedList.fromArray(expectedArray);

      // Act
      const receivedArray = Array.from(linkedList, (node) => node.data);

      // Assert
      expect(receivedArray).toEqual(expectedArray);
    });

    it('handles an empty list', () => {
      // Act and Assert
      expect(Array.from(linkedList)).toEqual([]);
    });
  });

  describe('toArray', () => {
    it('converts an empty list to an array', () => {
      // Act and Assert
      expect(linkedList.toArray()).toEqual([]);

      expect(linkedList.head).toBeNull();
      expect(linkedList.tail).toBeNull();
      expect(linkedList.size).toBe(0);
    });

    it('converts a list to an array', () => {
      // Arrange
      const expected = [1, 2];
      linkedList.fromArray(expected);

      // Act
      const received = linkedList.toArray();

      // Assert
      expect(received).toEqual(expected);
    });
  });

  describe('prepend', () => {
    it('prepends a new node to the beginning of the empty list', () => {
      // Act
      linkedList.prepend(1);

      // Assert
      expect(linkedList.head?.data).toBe(1);
      expect(linkedList.toString()).toBe('1');

      expect(linkedList.tail?.data).toBe(1);
      expect(linkedList.tail?.next).toBeNull();
      expect(linkedList.size).toBe(1);
    });

    it('prepends a new node to the beginning of a non-empty list', () => {
      // Arrange
      linkedList.append(2);

      // Act
      linkedList.prepend(1);

      // Assert
      expect(linkedList.toString()).toBe('1,2');
      expect(linkedList.tail?.data).toBe(2);
      expect(linkedList.tail?.next).toBeNull();

      expect(linkedList.size).toBe(2);
    });

    it('can be used in a call chain', () => {
      // Act
      linkedList.prepend(3).prepend(2).prepend(1);

      // Assert
      expect(linkedList.toString()).toBe('1,2,3');
      expect(linkedList.size).toBe(3);
    });
  });

  describe('delete', () => {
    it('returns null when deleting a non-existing node', () => {
      // Act
      const deletedNode = linkedList.delete(2);

      // Assert
      expect(deletedNode).toBeNull();
    });

    it('deletes the element outside the list', () => {
      // Arrange
      linkedList.fromArray([1, 2]);

      // Act
      const deletedNode = linkedList.delete(3);

      // Assert
      expect(deletedNode).toBeNull();
      expect(linkedList.toString()).toBe('1,2');
      expect(linkedList.tail?.data).toBe(2);
      expect(linkedList.size).toBe(2);
    });

    it('deletes the node from the singular node list', () => {
      // Arrange
      linkedList.append(1);

      // Act
      const deletedElement = linkedList.delete(1)!;

      // Assert
      expect(deletedElement.data).toBe(1);

      expect(linkedList.head).toBeNull();
      expect(linkedList.tail).toBeNull();
      expect(linkedList.size).toBe(0);
    });

    it('deletes the first node from the multi-node list', () => {
      // Arrange
      linkedList.fromArray([1, 2, 3]);

      // Act
      const deletedNode = linkedList.delete(1);

      // Assert
      expect(deletedNode?.data).toBe(1);
      expect(linkedList.toString()).toEqual('2,3');
      expect(linkedList.tail?.data).toBe(3);
      expect(linkedList.size).toBe(2);
    });

    it('deletes an element in the middle', () => {
      // Arrange
      linkedList.fromArray([1, 2, 3]);

      // Act
      const deletedElement = linkedList.delete(2);

      // Assert
      expect(deletedElement?.data).toBe(2);
      expect(linkedList.toString()).toBe('1,3');
      expect(linkedList.tail?.data).toBe(3);
      expect(linkedList.size).toBe(2);
    });

    it('deletes the last element', () => {
      // Arrange
      linkedList.fromArray([1, 2]);

      // Act
      const deletedElement = linkedList.delete(2);

      // Assert
      expect(deletedElement?.data).toBe(2);
      expect(linkedList.toString()).toBe('1');
      expect(linkedList.tail?.data).toBe(1);
      expect(linkedList.tail?.next).toBeNull();
      expect(linkedList.size).toBe(1);
    });

    it('deletes by predicate', () => {
      // Arrange
      type Value = {
        key: string;
        value: number;
      };

      const list = new LinkedList<Value>().fromArray([
        { key: 'one', value: 1 },
        { key: 'two', value: 2 },
        { key: 'three', value: 3 },
      ]);

      // Act
      const deletedNode = list.delete((pair) => pair.key === 'two');

      // Assert
      expect(deletedNode?.data.value).toBe(2);
      expect(list.toString((node) => `${node.value}`)).toBe('1,3');
      expect(list.size).toBe(2);
    });
  });

  describe('reverse', () => {
    it('reverses the empty list', () => {
      // Act
      linkedList.reverse();

      // Assert
      expect(linkedList.head).toBeNull();
      expect(linkedList.tail).toBeNull();
      expect(linkedList.size).toBe(0);
    });

    it('reverses the singular node list', () => {
      // Arrange
      linkedList.append(1);

      // Act
      linkedList.reverse();

      // Assert
      expect(linkedList.toString()).toBe('1');
      expect(linkedList.tail?.data).toBe(1);
      expect(linkedList.tail?.next).toBeNull();
      expect(linkedList.size).toBe(1);
    });

    it('reverses the the multi-node list', () => {
      // Arrange
      linkedList.fromArray([1, 2, 3]);

      expect(linkedList.toString()).toEqual('1,2,3');
      expect(linkedList.tail?.data).toBe(3);
      expect(linkedList.tail?.next).toBeNull();
      expect(linkedList.size).toBe(3);

      // Act
      linkedList.reverse();

      // Assert
      expect(linkedList.toString()).toEqual('3,2,1');
      expect(linkedList.tail?.data).toBe(1);
      expect(linkedList.tail?.next).toBeNull();
      expect(linkedList.size).toBe(3);
    });

    it('can be used in a call chain', () => {
      // Act
      linkedList.fromArray([2, 1]).reverse().append(3);

      // Assert
      expect(linkedList.head?.data).toBe(1);
      expect(linkedList.tail?.data).toBe(3);

      expect(linkedList.toString()).toBe('1,2,3');
      expect(linkedList.size).toBe(3);
    });
  });

  describe('insertAt', () => {
    it('throws an exception if the index is less than the list length', () => {
      // Act
      const received = () => linkedList.insertAt(-1, 1);

      // Assert
      expect(received).toThrow(
        'Index should be greater than or equal to 0 and less than or equal to the list length.',
      );
    });

    it('throws an exception if the index is greater than the list length', () => {
      // Act
      const received = () => linkedList.insertAt(10, 1);

      // Assert
      expect(received).toThrow(
        'Index should be greater than or equal to 0 and less than or equal to the list length.',
      );
    });

    it('inserts into the empty list', () => {
      // Act
      linkedList.insertAt(0, 1);

      // Assert
      expect(linkedList.toString()).toBe('1');
      expect(linkedList.tail?.data).toBe(1);
      expect(linkedList.tail?.next).toBeNull();
      expect(linkedList.size).toBe(1);
    });

    it('inserts at the beginning of the list', () => {
      // Arrange
      linkedList.append(2);

      // Act
      linkedList.insertAt(0, 1);

      // Assert
      expect(linkedList.toString()).toBe('1,2');
      expect(linkedList.tail?.data).toBe(2);
      expect(linkedList.tail?.next).toBeNull();
      expect(linkedList.size).toBe(2);
    });

    it('inserts into the middle of the list', () => {
      // Arrange
      linkedList.fromArray([1, 3]);

      // Act
      linkedList.insertAt(1, 2);

      // Assert
      expect(linkedList.toString()).toBe('1,2,3');
      expect(linkedList.tail?.data).toBe(3);
      expect(linkedList.tail?.next).toBeNull();
      expect(linkedList.size).toBe(3);
    });

    it('inserts at the end of the list', () => {
      // Arrange
      linkedList.append(1);

      // Act
      linkedList.insertAt(1, 2);

      // Assert
      expect(linkedList.toString()).toBe('1,2');
      expect(linkedList.tail?.data).toBe(2);
      expect(linkedList.tail?.next).toBeNull();
      expect(linkedList.size).toBe(2);
    });

    it('can be used in a call chain', () => {
      // Act
      linkedList.insertAt(0, 1).insertAt(1, 2);

      // Assert
      expect(linkedList.toString()).toBe('1,2');
      expect(linkedList.tail?.data).toBe(2);
      expect(linkedList.tail?.next).toBeNull();
      expect(linkedList.size).toBe(2);
    });
  });

  describe('deleteHead', () => {
    it('deletes the head from an empty list', () => {
      // Act
      const deletedHead = linkedList.deleteHead();

      // Assert
      expect(deletedHead).toBeNull();
      expect(linkedList.size).toBe(0);
    });

    it('deletes the head from the singular node list', () => {
      // Arrange
      linkedList.append(1);

      // Act
      const deletedHead = linkedList.deleteHead();

      // Assert
      expect(deletedHead?.data).toBe(1);

      expect(linkedList.head).toBeNull();
      expect(linkedList.tail).toBeNull();
      expect(linkedList.size).toBe(0);
    });

    it('removes the head from the multi-node list', () => {
      // Arrange
      linkedList.fromArray([1, 2]);

      // Act and Assert
      expect(linkedList.deleteHead()?.data).toBe(1);

      expect(linkedList.tail?.data).toBe(2);
      expect(linkedList.tail?.next).toBeNull();
      expect(linkedList.size).toBe(1);
    });
  });

  describe('deleteTail', () => {
    it('deletes the tail from an empty list', () => {
      // Act
      const deletedTail = linkedList.deleteTail();

      // Assert
      expect(deletedTail).toBeNull();
      expect(linkedList.size).toBe(0);
    });

    it('deletes the tail form the list with a single node', () => {
      // Arrange
      linkedList.append(1);

      // Act
      const deletedTail = linkedList.deleteTail();

      // Assert
      expect(deletedTail?.data).toBe(1);
      expect(linkedList.head).toBeNull();
      expect(linkedList.tail).toBeNull();
      expect(linkedList.size).toBe(0);
    });

    it('deletes the tail from the list with multiple nodes', () => {
      // Arrange
      linkedList.fromArray([1, 2]);

      // Act
      const deletedTail = linkedList.deleteTail();

      // Assert
      expect(deletedTail?.data).toBe(2);

      expect(linkedList.tail?.data).toBe(1);
      expect(linkedList.tail?.next).toBeNull();
      expect(linkedList.size).toBe(1);
    });
  });

  describe('indexOf', () => {
    it('returns -1 for an empty list', () => {
      // Act and Assert
      expect(linkedList.indexOf(42)).toBe(-1);
    });

    beforeEach(() => {
      // Arrange
      linkedList.fromArray([1, 2, 3, 3, 4]);
    });

    it('returns -1 for a value not present in the list', () => {
      // Act and Assert
      expect(linkedList.indexOf(42)).toBe(-1);
    });

    it('returns the correct index for a value present in the list', () => {
      // Act and Assert
      expect(linkedList.indexOf(2)).toBe(1);
    });

    it('returns the index of the first occurrence of the value', () => {
      // Act and Assert
      expect(linkedList.indexOf(3)).toBe(2);
    });

    it('returns the correct index for the head value', () => {
      // Act and Assert
      expect(linkedList.indexOf(1)).toBe(0);
    });

    it('returns the correct index for the tail value', () => {
      // Act and Assert
      expect(linkedList.indexOf(4)).toBe(4);
    });

    it('handles custom objects and comparison correctly', () => {
      type Item = {
        key: string;
      };
      // Arrange
      const list = new LinkedList<Item>().fromArray([
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
      expect(linkedList.find(1)).toBeNull();
      expect(linkedList.find((value) => value === 100)).toBeNull();
    });

    it('finds a node by value', () => {
      // Arrange
      linkedList.fromArray([1, 2]);

      // Act
      const foundedNode = linkedList.find(2);

      // Assert
      expect(foundedNode?.data).toBe(2);
    });

    it('finds a node by predicate', () => {
      // Arrange
      linkedList.fromArray([1, 2, 3]);

      // Act
      const foundedNode = linkedList.find((value) => value > 2);

      // Assert
      expect(foundedNode?.data).toBe(3);
    });

    it('prioritizes predicate over value', () => {
      // Arrange
      linkedList.fromArray([1, 2]);

      // Act
      const foundedNode = linkedList.find((value) => value > 1);

      // Assert
      expect(foundedNode?.data).toBe(2);
    });

    it('returns the first node if multiple nodes match the predicate', () => {
      // Arrange
      linkedList.fromArray([1, 2, 3, 4]);

      // Act
      const foundedNode = linkedList.find((value) => value > 1);

      // Assert
      expect(foundedNode?.data).toBe(2);
    });
  });

  describe('clear', () => {
    it('removes all nodes from the linked list', () => {
      // Arrange
      linkedList.fromArray([1, 2, 3]);

      // Act
      linkedList.clear();

      // Assert
      expect(linkedList.head).toBeNull();
      expect(linkedList.tail).toBeNull();
      expect(linkedList.size).toBe(0);
      expect(linkedList.isEmpty).toBeTruthy();
    });
  });
});
