/* eslint-disable no-restricted-syntax */
import { describe, beforeEach, it, expect } from 'vitest';
import { LinkedList } from '..';

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

  describe('isEmpty', () => {
    it('returns true for the empty list', () => {
      // Act and Assert
      expect(linkedList.isEmpty).toBeTruthy();
    });

    it('return false for the non-empty list', () => {
      // Arrange
      linkedList.append(1);

      // Act and Assert
      expect(linkedList.isEmpty).toBeFalsy();
    });
  });

  describe('append', () => {
    it('appends node to the empty list', () => {
      // Act
      linkedList.append(1);

      // Assert
      expect(linkedList.head?.value).toBe(1);
      expect(linkedList.head?.next).toBeNull();

      expect(linkedList.tail?.value).toBe(1);
      expect(linkedList.tail?.next).toBeNull();

      expect(linkedList.size).toBe(1);
    });

    it('appends nodes to the non-empty list', () => {
      // Arrange
      linkedList.append(1);

      // Act
      linkedList.append(2);

      // Assert
      expect(linkedList.head?.value).toBe(1);
      expect(linkedList.head?.next?.value).toBe(2);

      expect(linkedList.tail?.value).toBe(2);
      expect(linkedList.tail?.next).toBeNull();

      expect(linkedList.toString()).toBe('1,2');
      expect(linkedList.size).toBe(2);
    });

    it('can be used in a call chain', () => {
      // Act
      linkedList.append(1).append(2).append(3);

      // Assert
      expect(linkedList.toString()).toBe('1,2,3');
      expect(linkedList.size).toBe(3);
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
      linkedList.fromArray([1, 2, 3, 4]);

      // Assert
      expect(linkedList.toString()).toBe('1,2,3,4');
    });
  });

  describe('Iterator', () => {
    it('iterates through the elements of the list', () => {
      // Arrange
      linkedList.fromArray([1, 2, 3]);
      let values: number[] = [];

      // Act
      for (const node of linkedList) {
        values.push(node?.value);
      }

      // Assert
      expect(values).toEqual([1, 2, 3]);
    });

    it('handles an empty list', () => {
      // Arrange
      let values: number[] = [];

      // Act
      for (const node of linkedList) {
        values.push(node?.value);
      }

      // Assert
      expect(values).toEqual([]);
    });
  });

  describe('toArray', () => {
    it('returns an empty array for the empty list', () => {
      // Act and Assert
      expect(linkedList.toArray()).toEqual([]);
      expect(linkedList.head).toBeNull();
      expect(linkedList.tail).toBeNull();
      expect(linkedList.size).toBe(0);
    });
  });

  describe('toString', () => {
    it('returns an empty string for the empty list', () => {
      // Act and Assert
      expect(linkedList.toString()).toBe('');
      expect(linkedList.head).toBeNull();
      expect(linkedList.tail).toBeNull();
      expect(linkedList.size).toBe(0);
    });
  });

  describe('prepend', () => {
    it('prepends a new node to the beginning of the empty list', () => {
      // Act
      linkedList.prepend(1);

      // Assert
      expect(linkedList.head?.value).toBe(1);
      expect(linkedList.head?.next).toBeNull();

      expect(linkedList.tail?.value).toBe(1);
      expect(linkedList.tail?.next).toBeNull();
      expect(linkedList.size).toBe(1);
    });

    it('prepends a new node to the beginning of a non-empty list', () => {
      // Arrange
      linkedList.append(2);

      // Act
      linkedList.prepend(1);

      // Assert
      expect(linkedList.head?.value).toBe(1);
      expect(linkedList.head?.next?.value).toBe(2);

      expect(linkedList.tail?.value).toBe(2);
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
      const deletedNode = linkedList.delete(5);

      // Assert
      expect(deletedNode).toBeNull();
      expect(linkedList.head).toBeNull();
      expect(linkedList.tail).toBeNull();
      expect(linkedList.size).toBe(0);
    });

    it('deletes the element outside the list', () => {
      // Arrange
      linkedList.fromArray([1, 2]);

      // Act
      const deletedNode = linkedList.delete(3);

      // Assert
      expect(deletedNode).toBeNull();
      expect(linkedList.head?.value).toBe(1);
      expect(linkedList.tail?.value).toBe(2);
      expect(linkedList.tail?.next).toBeNull();

      expect(linkedList.toString()).toBe('1,2');
      expect(linkedList.size).toBe(2);
    });

    it('deletes the node from the singular node list', () => {
      // Arrange
      linkedList.append(1);

      // Act
      const deletedElement = linkedList.delete(1)!;

      // Assert
      expect(deletedElement.value).toBe(1);
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
      expect(deletedNode?.value).toBe(1);

      expect(linkedList.head?.value).toBe(2);
      expect(linkedList.head?.next?.value).toBe(3);
      expect(linkedList.tail?.value).toBe(3);

      expect(linkedList.toString()).toEqual('2,3');
      expect(linkedList.size).toBe(2);
    });

    it('deletes an element in the middle', () => {
      // Arrange
      linkedList.fromArray([1, 2, 3, 4]);

      // Act
      const deletedElement = linkedList.delete(2);

      // Assert
      expect(deletedElement?.value).toBe(2);

      expect(linkedList.head?.value).toBe(1);
      expect(linkedList.head?.next?.value).toBe(3);
      expect(linkedList.tail?.value).toBe(4);

      expect(linkedList.toString()).toBe('1,3,4');
      expect(linkedList.size).toBe(3);
    });

    it('deletes the last element', () => {
      // Arrange
      linkedList.fromArray([1, 2, 3]);

      // Act
      const deletedElement = linkedList.delete(3);

      // Assert
      expect(deletedElement?.value).toBe(3);

      expect(linkedList.head?.value).toBe(1);
      expect(linkedList.head?.next?.value).toBe(2);

      expect(linkedList.tail?.value).toBe(2);
      expect(linkedList.tail?.next).toBeNull();

      expect(linkedList.toString()).toBe('1,2');
      expect(linkedList.size).toBe(2);
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

    it('reverses the head of the singular node list', () => {
      // Arrange
      linkedList.append(1);

      // Act
      linkedList.reverse();

      // Assert
      expect(linkedList.head?.value).toBe(1);
      expect(linkedList.tail?.value).toBe(1);
      expect(linkedList.toString()).toBe('1');
      expect(linkedList.size).toBe(1);
    });

    it('reverses the list', () => {
      // Arrange
      linkedList.fromArray([1, 2, 3]);

      // Act
      linkedList.reverse();

      // Assert
      expect(linkedList.head?.value).toBe(3);
      expect(linkedList.head?.next?.value).toBe(2);
      expect(linkedList.tail?.value).toBe(1);
      expect(linkedList.tail?.next).toBeNull();

      expect(linkedList.toString()).toEqual('3,2,1');
      expect(linkedList.size).toBe(3);
    });

    it('can be used in a call chain', () => {
      // Act
      linkedList.fromArray([1, 2, 3]).reverse().append(4);

      // Assert
      expect(linkedList.head?.value).toBe(3);
      expect(linkedList.tail?.value).toBe(4);
      expect(linkedList.tail?.next).toBeNull();

      expect(linkedList.toString()).toBe('3,2,1,4');
      expect(linkedList.size).toBe(4);
    });
  });

  describe('insertAt', () => {
    it('throws exception if index less than list length', () => {
      // Act
      const received = () => linkedList.insertAt(-1, 1);

      // Assert
      expect(received).toThrow(
        'Index should be greater than or equal to 0 and less than or equal to the list length.',
      );
    });

    it('throws exception if index greater than list length', () => {
      // Act
      const received = () => linkedList.insertAt(10, 1);

      // Assert
      expect(received).toThrow(
        'Index should be greater than or equal to 0 and less than or equal to the list length.',
      );
    });

    it('inserts at the beginning of the list', () => {
      // Arrange
      linkedList.append(1);

      // Act
      linkedList.insertAt(0, 0);

      // Assert
      expect(linkedList.head?.value).toBe(0);
      expect(linkedList.head?.next?.value).toBe(1);
      expect(linkedList.tail?.value).toBe(1);
      expect(linkedList.tail?.next).toBeNull();

      expect(linkedList.toString()).toBe('0,1');
      expect(linkedList.size).toBe(2);
    });

    it('inserts at the end of the list', () => {
      // Arrange
      linkedList.append(1);

      // Act
      linkedList.insertAt(1, 2);

      // Assert
      expect(linkedList.head?.value).toBe(1);
      expect(linkedList.head?.next?.value).toBe(2);
      expect(linkedList.tail?.value).toBe(2);
      expect(linkedList.tail?.next).toBeNull();

      expect(linkedList.toString()).toBe('1,2');
      expect(linkedList.size).toBe(2);
    });

    it('inserts in the middle of the list', () => {
      // Arrange
      linkedList.append(1).append(2).append(4);

      // Act
      linkedList.insertAt(2, 3);

      // Assert
      expect(linkedList.head?.value).toBe(1);
      expect(linkedList.head?.next?.next?.value).toBe(3);
      expect(linkedList.tail?.value).toBe(4);
      expect(linkedList.tail?.next).toBeNull();

      expect(linkedList.toString()).toBe('1,2,3,4');
      expect(linkedList.size).toBe(4);
    });

    it('can be used in a call chain', () => {
      // Act
      linkedList.insertAt(0, 1).insertAt(1, 2);

      // Assert
      expect(linkedList.head?.value).toBe(1);
      expect(linkedList.tail?.value).toBe(2);

      expect(linkedList.toString()).toBe('1,2');
      expect(linkedList.size).toBe(2);
    });
  });

  describe('deleteHead', () => {
    it('deletes the head from an empty list', () => {
      // Act
      const deletedHead = linkedList.deleteHead();

      // Assert
      expect(deletedHead).toBeNull();
      expect(linkedList.head).toBeNull();
      expect(linkedList.tail).toBeNull();
      expect(linkedList.size).toBe(0);
    });

    it('deletes the head from the list with multiple nodes', () => {
      // Arrange
      linkedList.fromArray([1, 2, 3]);

      // Act
      const deletedHead = linkedList.deleteHead();

      // Assert
      expect(deletedHead?.value).toBe(1);

      expect(linkedList.head?.value).toBe(2);
      expect(linkedList.head?.next?.value).toBe(3);

      expect(linkedList.tail?.value).toBe(3);
      expect(linkedList.tail?.next).toBeNull();

      expect(linkedList.toString()).toBe('2,3');
      expect(linkedList.size).toBe(2);
    });
  });

  describe('deleteTail', () => {
    it('deletes the tail from an empty list', () => {
      // Act
      const deletedTail = linkedList.deleteTail();

      // Assert
      expect(deletedTail).toBeNull();
      expect(linkedList.head).toBeNull();
      expect(linkedList.tail).toBeNull();
      expect(linkedList.size).toBe(0);
    });

    it('deletes the tail form the list with a single node', () => {
      // Arrange
      linkedList.append(1);

      // Act
      const deletedTail = linkedList.deleteTail();

      // Assert
      expect(deletedTail?.value).toBe(1);
      expect(linkedList.head).toBeNull();
      expect(linkedList.tail).toBeNull();
      expect(linkedList.size).toBe(0);
    });

    it('deletes the tail from the list with multiple nodes', () => {
      // Arrange
      linkedList.fromArray([1, 2, 3]);

      // Act
      const deletedTail = linkedList.deleteTail();

      // Assert
      expect(deletedTail?.value).toBe(3);

      expect(linkedList.head?.value).toBe(1);
      expect(linkedList.tail?.value).toBe(2);
      expect(linkedList.tail?.next).toBeNull();

      expect(linkedList.toString()).toBe('1,2');
    });
  });

  describe('indexOf', () => {
    it('returns -1 for an empty list', () => {
      // Act and Assert
      expect(linkedList.indexOf(42)).toBe(-1);
    });

    beforeEach(() => {
      // Arrange
      linkedList.fromArray([1, 2, 3, 4, 5]);
    });

    it('returns -1 for a value not present in the list', () => {
      // Act and Assert
      expect(linkedList.indexOf(42)).toBe(-1);
    });

    it('returns the correct index for a value present in the list', () => {
      // Act and Assert
      expect(linkedList.indexOf(3)).toBe(2);
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
      expect(linkedList.indexOf(5)).toBe(4);
    });

    it('handles custom objects and comparison correctly', () => {
      // Arrange
      const list = new LinkedList().fromArray([
        { key: 'value1' },
        { key: 'value2' },
      ]);

      // Act and Assert
      expect(list.indexOf({ key: 'value1' })).toBe(0);
    });
  });

  describe('find', () => {
    it('returns null for an empty list', () => {
      // Act and Assert
      expect(linkedList.find({ value: 1 })).toBeNull();
    });

    it('finds a node by value', () => {
      // Arrange
      linkedList.fromArray([1, 2]);

      // Act
      const foundedNode = linkedList.find({ value: 2 });

      // Assert
      expect(foundedNode?.value).toBe(2);
    });

    it('finds a node by predicate', () => {
      // Arrange
      linkedList.fromArray([1, 2, 3]);

      // Act
      const foundedNode = linkedList.find({
        predicate: (value) => value > 2,
      });

      // Assert
      expect(foundedNode?.value).toBe(3);
    });

    it('returns null if a node is not found by value or predicate', () => {
      // Act
      const foundedNode = linkedList.find({ value: 3 });

      // Assert
      expect(foundedNode).toBeNull();
    });

    it('prioritizes predicate over value', () => {
      // Arrange
      linkedList.fromArray([1, 2]);

      // Act
      const foundedNode = linkedList.find({
        predicate: (value) => value > 1,
      });

      // Assert
      expect(foundedNode?.value).toBe(2);
    });

    it('returns the first node if multiple nodes match the predicate', () => {
      // Arrange
      linkedList.fromArray([1, 2, 3, 4]);

      // Act
      const foundedNode = linkedList.find({
        predicate: (value) => value > 1,
      });

      // Assert
      expect(foundedNode?.value).toBe(2);
    });
  });

  describe('clear', () => {
    it('removes all nodes from the linked list', () => {
      // Arrange
      linkedList.fromArray([1, 2, 3, 4]);

      // Act
      linkedList.clear();

      // Assert
      expect(linkedList.head).toBeNull();
      expect(linkedList.tail).toBeNull();
      expect(linkedList.size).toBe(0);
      expect(linkedList.isEmpty).toBeTruthy();
    });

    it('works correctly on an empty linked list', () => {
      // Act
      linkedList.clear();
      expect(linkedList.head).toBeNull();
      expect(linkedList.tail).toBeNull();
      expect(linkedList.size).toBe(0);
      expect(linkedList.isEmpty).toBeTruthy();
    });
  });
});
