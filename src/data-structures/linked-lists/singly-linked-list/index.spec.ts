import { beforeEach, describe, expect, it } from 'vitest';
import { SinglyLinkedList } from './index';

describe('SinglyLinkedList', () => {
  let singlyList: SinglyLinkedList<number>;

  // Arrange
  beforeEach(() => {
    singlyList = new SinglyLinkedList();
  });

  it('returns the initial state of the list correctly', () => {
    // Assert
    expect(singlyList.head).toBeNull();
    expect(singlyList.tail).toBeNull();
    expect(singlyList.size).toBe(0);
  });

  describe('append', () => {
    it('appends node to the empty list', () => {
      // Act
      singlyList.append(1);

      // Assert
      expect(singlyList.head?.data).toBe(1);
      expect(singlyList.head?.next).toBeNull();

      expect(singlyList.tail?.data).toBe(1);
      expect(singlyList.tail?.next).toBeNull();

      expect(singlyList.size).toBe(1);
    });

    it('appends nodes to the non-empty list', () => {
      // Arrange
      singlyList.append(1);

      // Act
      singlyList.append(2);

      // Assert
      expect(singlyList.head?.data).toBe(1);
      expect(singlyList.head?.next?.data).toBe(2);

      expect(singlyList.tail?.data).toBe(2);
      expect(singlyList.tail?.next).toBeNull();
      expect(singlyList.size).toBe(2);
    });

    it('can be used in a call chain', () => {
      // Act
      singlyList.append(1).append(2).append(3);

      // Assert
      expect(singlyList.head?.data).toBe(1);
      expect(singlyList.head?.next?.data).toBe(2);
      expect(singlyList.head?.next?.next?.data).toBe(3);

      expect(singlyList.tail?.data).toBe(3);
      expect(singlyList.tail?.next).toBeNull();
      expect(singlyList.size).toBe(3);
    });
  });

  describe('isEmpty', () => {
    it('works correctly', () => {
      // Assert
      expect(singlyList.isEmpty).toBeTruthy();

      singlyList.append(1);

      // Act and Assert
      expect(singlyList.isEmpty).toBeFalsy();
    });

    it('return false for the non-empty list', () => {});
  });

  describe('toString', () => {
    it('converts the list to the string', () => {
      // Arrange
      singlyList.fromArray([1, 2, 3]);

      // Act and Assert
      expect(singlyList.toString()).toBe('1,2,3');
    });

    it('converts to list to string with custom callback', () => {
      // Arrange
      type Payload = {
        key: string;
        value: number;
      };

      const list = new SinglyLinkedList<Payload>().fromArray([
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
      singlyList.fromArray([]);

      // Assert
      expect(singlyList.isEmpty).toBeTruthy();
    });

    it('creates a list with the same nodes as the input array', () => {
      // Act
      singlyList.fromArray([1, 2, 3]);

      // Assert
      expect(singlyList.head?.data).toBe(1);
      expect(singlyList.head?.next?.data).toBe(2);
      expect(singlyList.head?.next?.next?.data).toBe(3);

      expect(singlyList.tail?.data).toBe(3);
      expect(singlyList.tail?.next).toBeNull();

      expect(singlyList.toString()).toBe('1,2,3');
      expect(singlyList.size).toBe(3);
    });
  });

  describe('Iterator', () => {
    it('iterates through the elements of the list', () => {
      // Arrange
      const expectedArray = [1, 2, 3];
      singlyList.fromArray(expectedArray);

      // Act
      const receivedArray = Array.from(singlyList, (node) => node.data);

      // Assert
      expect(receivedArray).toEqual(expectedArray);
    });

    it('handles an empty list', () => {
      // Act and Assert
      expect(Array.from(singlyList)).toEqual([]);
    });
  });

  describe('toArray', () => {
    it('converts an empty list to an array', () => {
      // Act and Assert
      expect(singlyList.toArray()).toEqual([]);

      expect(singlyList.head).toBeNull();
      expect(singlyList.tail).toBeNull();
      expect(singlyList.size).toBe(0);
    });

    it('converts a list to an array', () => {
      // Arrange
      const expected = [1, 2];
      singlyList.fromArray(expected);

      // Act
      const received = singlyList.toArray();

      // Assert
      expect(received).toEqual(expected);
    });
  });

  describe('prepend', () => {
    it('prepends a new node to the beginning of the empty list', () => {
      // Act
      singlyList.prepend(1);

      // Assert
      expect(singlyList.head?.data).toBe(1);
      expect(singlyList.toString()).toBe('1');

      expect(singlyList.tail?.data).toBe(1);
      expect(singlyList.tail?.next).toBeNull();
      expect(singlyList.size).toBe(1);
    });

    it('prepends a new node to the beginning of a non-empty list', () => {
      // Arrange
      singlyList.append(2);

      // Act
      singlyList.prepend(1);

      // Assert
      expect(singlyList.toString()).toBe('1,2');
      expect(singlyList.tail?.data).toBe(2);
      expect(singlyList.tail?.next).toBeNull();

      expect(singlyList.size).toBe(2);
    });

    it('can be used in a call chain', () => {
      // Act
      singlyList.prepend(3).prepend(2).prepend(1);

      // Assert
      expect(singlyList.toString()).toBe('1,2,3');
      expect(singlyList.size).toBe(3);
    });
  });

  describe('insertAt', () => {
    it('throws an exception if the index is less than the list length', () => {
      // Act
      const received = () => singlyList.insertAt(-1, 1);

      // Assert
      expect(received).toThrow(RangeError);
      expect(received).toThrow(
        'Index should be greater than or equal to 0 and less than or equal to the list length.',
      );
    });

    it('throws an exception if the index is greater than the list length', () => {
      // Act
      const received = () => singlyList.insertAt(10, 1);

      // Assert
      expect(received).toThrow(RangeError);
      expect(received).toThrow(
        'Index should be greater than or equal to 0 and less than or equal to the list length.',
      );
    });

    it('inserts into the empty list', () => {
      // Act
      singlyList.insertAt(0, 1);

      // Assert
      expect(singlyList.toString()).toBe('1');
      expect(singlyList.tail?.data).toBe(1);
      expect(singlyList.tail?.next).toBeNull();
      expect(singlyList.size).toBe(1);
    });

    it('inserts at the beginning of the list', () => {
      // Arrange
      singlyList.append(2);

      // Act
      singlyList.insertAt(0, 1);

      // Assert
      expect(singlyList.toString()).toBe('1,2');
      expect(singlyList.tail?.data).toBe(2);
      expect(singlyList.tail?.next).toBeNull();
      expect(singlyList.size).toBe(2);
    });

    it('inserts into the middle of the list', () => {
      // Arrange
      singlyList.fromArray([1, 3]);

      // Act
      singlyList.insertAt(1, 2);

      // Assert
      expect(singlyList.toString()).toBe('1,2,3');
      expect(singlyList.tail?.data).toBe(3);
      expect(singlyList.tail?.next).toBeNull();
      expect(singlyList.size).toBe(3);
    });

    it('inserts at the end of the list', () => {
      // Arrange
      singlyList.append(1);

      // Act
      singlyList.insertAt(1, 2);

      // Assert
      expect(singlyList.toString()).toBe('1,2');
      expect(singlyList.tail?.data).toBe(2);
      expect(singlyList.tail?.next).toBeNull();
      expect(singlyList.size).toBe(2);
    });

    it('can be used in a call chain', () => {
      // Act
      singlyList.insertAt(0, 1).insertAt(1, 2);

      // Assert
      expect(singlyList.toString()).toBe('1,2');
      expect(singlyList.tail?.data).toBe(2);
      expect(singlyList.tail?.next).toBeNull();
      expect(singlyList.size).toBe(2);
    });
  });

  describe('delete', () => {
    it('returns null when deleting a non-existing node', () => {
      // Act
      const deletedNode = singlyList.deleteByValue(2);

      // Assert
      expect(deletedNode).toBeNull();
    });

    it('deletes the element outside the list', () => {
      // Arrange
      singlyList.fromArray([1, 2]);

      // Act
      const deletedNode = singlyList.deleteByValue(3);

      // Assert
      expect(deletedNode).toBeNull();
      expect(singlyList.toString()).toBe('1,2');
      expect(singlyList.tail?.data).toBe(2);
      expect(singlyList.size).toBe(2);
    });

    it('deletes the node from the singular node list', () => {
      // Arrange
      singlyList.append(1);

      // Act
      const deletedElement = singlyList.deleteByValue(1)!;

      // Assert
      expect(deletedElement.data).toBe(1);

      expect(singlyList.head).toBeNull();
      expect(singlyList.tail).toBeNull();
      expect(singlyList.size).toBe(0);
    });

    it('deletes the first node from the multi-node list', () => {
      // Arrange
      singlyList.fromArray([1, 2, 3]);

      // Act
      const deletedNode = singlyList.deleteByValue(1);

      // Assert
      expect(deletedNode?.data).toBe(1);
      expect(singlyList.toString()).toEqual('2,3');
      expect(singlyList.tail?.data).toBe(3);
      expect(singlyList.size).toBe(2);
    });

    it('deletes an element in the middle', () => {
      // Arrange
      singlyList.fromArray([1, 2, 3]);

      // Act
      const deletedElement = singlyList.deleteByValue(2);

      // Assert
      expect(deletedElement?.data).toBe(2);
      expect(singlyList.toString()).toBe('1,3');
      expect(singlyList.tail?.data).toBe(3);
      expect(singlyList.size).toBe(2);
    });

    it('deletes the last element', () => {
      // Arrange
      singlyList.fromArray([1, 2]);

      // Act
      const deletedElement = singlyList.deleteByValue(2);

      // Assert
      expect(deletedElement?.data).toBe(2);
      expect(singlyList.toString()).toBe('1');
      expect(singlyList.tail?.data).toBe(1);
      expect(singlyList.tail?.next).toBeNull();
      expect(singlyList.size).toBe(1);
    });

    it('deletes by predicate', () => {
      // Arrange
      type Value = {
        key: string;
        value: number;
      };

      const list = new SinglyLinkedList<Value>().fromArray([
        { key: 'one', value: 1 },
        { key: 'two', value: 2 },
        { key: 'three', value: 3 },
      ]);

      // Act
      const deletedNode = list.deleteByValue((pair) => pair.key === 'two');

      // Assert
      expect(deletedNode?.data.value).toBe(2);
      expect(list.toString((node) => `${node.value}`)).toBe('1,3');
      expect(list.size).toBe(2);
    });
  });

  describe('deleteHead', () => {
    it('deletes the head from an empty list', () => {
      // Act
      const deletedHead = singlyList.deleteHead();

      // Assert
      expect(deletedHead).toBeNull();
      expect(singlyList.size).toBe(0);
    });

    it('deletes the head from the singular node list', () => {
      // Arrange
      singlyList.append(1);

      // Act
      const deletedHead = singlyList.deleteHead();

      // Assert
      expect(deletedHead?.data).toBe(1);

      expect(singlyList.head).toBeNull();
      expect(singlyList.tail).toBeNull();
      expect(singlyList.size).toBe(0);
    });

    it('removes the head from the multi-node list', () => {
      // Arrange
      singlyList.fromArray([1, 2]);

      // Act and Assert
      expect(singlyList.deleteHead()?.data).toBe(1);

      expect(singlyList.tail?.data).toBe(2);
      expect(singlyList.tail?.next).toBeNull();
      expect(singlyList.size).toBe(1);
    });
  });

  describe('deleteTail', () => {
    it('deletes the tail from an empty list', () => {
      // Act
      const deletedTail = singlyList.deleteTail();

      // Assert
      expect(deletedTail).toBeNull();
      expect(singlyList.size).toBe(0);
    });

    it('deletes the tail form the list with a single node', () => {
      // Arrange
      singlyList.append(1);

      // Act
      const deletedTail = singlyList.deleteTail();

      // Assert
      expect(deletedTail?.data).toBe(1);
      expect(singlyList.head).toBeNull();
      expect(singlyList.tail).toBeNull();
      expect(singlyList.size).toBe(0);
    });

    it('deletes the tail from the list with multiple nodes', () => {
      // Arrange
      singlyList.fromArray([1, 2]);

      // Act
      const deletedTail = singlyList.deleteTail();

      // Assert
      expect(deletedTail?.data).toBe(2);

      expect(singlyList.tail?.data).toBe(1);
      expect(singlyList.tail?.next).toBeNull();
      expect(singlyList.size).toBe(1);
    });
  });

  describe('indexOf', () => {
    it('returns -1 for an empty list', () => {
      // Act and Assert
      expect(singlyList.indexOf(42)).toBe(-1);
    });

    beforeEach(() => {
      // Arrange
      singlyList.fromArray([1, 2, 3, 3, 4]);
    });

    it('returns -1 for a value not present in the list', () => {
      // Act and Assert
      expect(singlyList.indexOf(42)).toBe(-1);
    });

    it('returns the correct index for a value present in the list', () => {
      // Act and Assert
      expect(singlyList.indexOf(2)).toBe(1);
    });

    it('returns the index of the first occurrence of the value', () => {
      // Act and Assert
      expect(singlyList.indexOf(3)).toBe(2);
    });

    it('returns the correct index for the head value', () => {
      // Act and Assert
      expect(singlyList.indexOf(1)).toBe(0);
    });

    it('returns the correct index for the tail value', () => {
      // Act and Assert
      expect(singlyList.indexOf(4)).toBe(4);
    });

    it('handles custom objects and comparison correctly', () => {
      type Item = {
        key: string;
      };
      // Arrange
      const list = new SinglyLinkedList<Item>().fromArray([
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
      expect(singlyList.find(1)).toBeNull();
      expect(singlyList.find((value) => value === 100)).toBeNull();
    });

    it('finds a node by value', () => {
      // Arrange
      singlyList.fromArray([1, 2]);

      // Act
      const foundedNode = singlyList.find(2);

      // Assert
      expect(foundedNode?.data).toBe(2);
    });

    it('finds a node by predicate', () => {
      // Arrange
      singlyList.fromArray([1, 2, 3]);

      // Act
      const foundedNode = singlyList.find((value) => value > 2);

      // Assert
      expect(foundedNode?.data).toBe(3);
    });

    it('prioritizes predicate over value', () => {
      // Arrange
      singlyList.fromArray([1, 2]);

      // Act
      const foundedNode = singlyList.find((value) => value > 1);

      // Assert
      expect(foundedNode?.data).toBe(2);
    });

    it('returns the first node if multiple nodes match the predicate', () => {
      // Arrange
      singlyList.fromArray([1, 2, 3, 4]);

      // Act
      const foundedNode = singlyList.find((value) => value > 1);

      // Assert
      expect(foundedNode?.data).toBe(2);
    });
  });

  describe('reverse', () => {
    it('reverses the empty list', () => {
      // Act
      singlyList.reverse();

      // Assert
      expect(singlyList.head).toBeNull();
      expect(singlyList.tail).toBeNull();
      expect(singlyList.size).toBe(0);
    });

    it('reverses the singular node list', () => {
      // Arrange
      singlyList.append(1);

      // Act
      singlyList.reverse();

      // Assert
      expect(singlyList.toString()).toBe('1');
      expect(singlyList.tail?.data).toBe(1);
      expect(singlyList.tail?.next).toBeNull();
      expect(singlyList.size).toBe(1);
    });

    it('reverses the the multi-node list', () => {
      // Arrange
      singlyList.fromArray([1, 2, 3]);

      expect(singlyList.toString()).toEqual('1,2,3');
      expect(singlyList.tail?.data).toBe(3);
      expect(singlyList.tail?.next).toBeNull();
      expect(singlyList.size).toBe(3);

      // Act
      singlyList.reverse();

      // Assert
      expect(singlyList.toString()).toEqual('3,2,1');
      expect(singlyList.tail?.data).toBe(1);
      expect(singlyList.tail?.next).toBeNull();
      expect(singlyList.size).toBe(3);
    });

    it('can be used in a call chain', () => {
      // Act
      singlyList.fromArray([2, 1]).reverse().append(3);

      // Assert
      expect(singlyList.head?.data).toBe(1);
      expect(singlyList.tail?.data).toBe(3);

      expect(singlyList.toString()).toBe('1,2,3');
      expect(singlyList.size).toBe(3);
    });
  });

  describe('clear', () => {
    it('removes all nodes from the linked list', () => {
      // Arrange
      singlyList.fromArray([1, 2, 3]);

      // Act
      singlyList.clear();

      // Assert
      expect(singlyList.head).toBeNull();
      expect(singlyList.tail).toBeNull();
      expect(singlyList.size).toBe(0);
      expect(singlyList.isEmpty).toBeTruthy();
    });
  });

  describe('toStringTag', () => {
    it('returns correct string representation', () => {
      // Assert
      expect(Object.prototype.toString.call(new SinglyLinkedList())).toBe(
        '[object SinglyLinkedList]',
      );
    });
  });
});
