import { describe, beforeEach, it, expect } from 'bun:test';

import { LinkedList } from './linked-list';
import { LinkedListNode } from '../linked-list-node';

describe('LinkedList', () => {
  // @ts-ignore
  let list: LinkedList<number> = null;

  // Arrange
  beforeEach(() => {
    list = new LinkedList();
  });

  describe('append method', () => {
    const list = new LinkedList<number>();
    it('should append node correctly to the empty list', () => {
      // Assert
      expect(list.isEmpty()).toBeTruthy();
      expect(list.head).toBeNull();
      expect(list.tail).toBeNull();

      // Act
      list.append(1);

      // Assert
      expect(list.head!.toString()).toBe('1');
      expect(list.tail!.toString()).toBe('1');
      expect(list.length).toBe(1);
    });

    it('should append correctly node to the non-empty list', () => {
      // Act
      list.append(1).append(2);

      // Assert
      expect(list.length).toBe(2);
      expect(list.head!.toString()).toBe('1');
      expect(list.tail!.toString()).toBe('2');
      expect(list.toString()).toBe('1,2');
      expect(list.tail!.next).toBeNull();
    });
  });

  describe('toArray method', () => {
    it('should return an empty array for an empty list', () => {
      // Act and Assert
      expect(list.toArray()).toEqual([]);
    });

    it('should return an array with the same values as the list', () => {
      // Act
      list.append(1).append(2).append(3);

      // Assert
      expect(list.toArray().join(',')).toBe('1,2,3');
    });
  });

  describe('toString method', () => {
    it('should return an empty string for an empty list', () => {
      // Act and Assert
      expect(list.toString()).toBe('');
    });

    it('should return a string representation of the list', () => {
      // Act
      list.append(1).append(2).append(3);

      // Assert
      expect(list.toString()).toBe('1,2,3');
    });
  });

  describe('indexOf method', () => {
    // @ts-ignore
    let linkedList: LinkedList = null;

    // Arrange
    beforeEach(() => {
      linkedList = new LinkedList();

      // Act
      linkedList.append(1).append(2).append(3);
    });

    it('should return the index of the given element if it exists in the list', () => {
      // Act and Assert
      expect(linkedList!.indexOf(2)).toBe(1);
    });

    it("should return `-1` if the given element doesn't exist in the list", () => {
      // Act and Assert
      expect(linkedList!.indexOf(4)).toBe(-1);
    });

    it('should return the index of the first occurrence of the given element', () => {
      // Act
      linkedList.append(2);

      // Act and Assert
      expect(linkedList.indexOf(2)).toBe(1);
    });

    it('should return `0` if the index is at the head of the list', () => {
      // Act and Assert
      expect(linkedList.indexOf(1)).toBe(0);
    });

    it('should return the index of the last element if the element is at the tail of the list', () => {
      // Act and Assert
      expect(linkedList.indexOf(3)).toBe(2);
    });

    it('should return `-1` if the list is empty', () => {
      // Arrange
      linkedList = new LinkedList();

      // Act and Assert
      expect(linkedList.indexOf(1)).toBe(-1);
    });

    describe('on an empty list', () => {
      // Arrange
      beforeEach(() => {
        linkedList = new LinkedList();
      });

      it('should return `-1` for any element', () => {
        // Act and Assert
        expect(linkedList.indexOf(1)).toBe(-1);
        expect(linkedList.indexOf(2)).toBe(-1);
        expect(linkedList.indexOf(3)).toBe(-1);
      });
    });
  });

  describe('fromArray method', () => {
    it('should create an empty list when an empty array is passed', () => {
      // Act
      list.fromArray([]);

      // Act and Assert
      expect(list.isEmpty()).toBeTruthy();
    });

    it('should create a list with the same nodes as the input array', () => {
      // Act
      list.fromArray([1, 2, 3, 4]);

      // Act and Assert
      expect(list.toString()).toBe('1,2,3,4');
    });
  });

  describe('prepend method', () => {
    it('should prepend a new node to the beginning of an empty list', () => {
      // Act and Assert
      expect(list.isEmpty()).toBeTruthy();

      // Act
      list.prepend(1);

      // Act and Assert
      expect(list.toString()).toBe('1');
      expect(list.head!.toString()).toBe('1');
      expect(list.tail!.toString()).toBe('1');
      expect(list.tail!.next).toBeNull();
      expect(list.length).toBe(1);
    });

    it('should add new node to the beginning of a non-empty list', () => {
      // Act
      list.append(2).append(3).prepend(1);

      // Act and Assert
      expect(list.toString()).toBe('1,2,3');
      expect(list.head!.toString()).toBe('1');
      expect(list.tail!.toString()).toBe('3');
      expect(list.tail!.next).toBeNull();
      expect(list.length).toBe(3);
    });

    it('should prepend node to the lined list', () => {
      // Arrange
      const list: LinkedList = new LinkedList();

      // Assert
      expect(list.isEmpty()).toBeTruthy();
      expect(list.head).toBeNull();
      expect(list.tail).toBeNull();

      // Act
      list.append(1).prepend(2);

      // Assert
      expect(list.length).toBe(2);
      expect(list.head!.toString()).toBe('2');
      expect(list.tail!.toString()).toBe('1');
      expect(list.tail!.next).toBeNull();
    });
  });

  describe('reverse method', () => {
    it('should reverse the empty list correctly', () => {
      // Act
      list.reverse();

      // Act and Assert
      expect(list.toString()).toBe('');
    });

    it('should reverse the list with a single element correctly', () => {
      // Act
      list.append(1).reverse();

      // Act and Assert
      expect(list.head!.toString()).toBe('1');
      expect(list.tail!.toString()).toBe('1');
      expect(list.toString()).toBe('1');
    });

    it('should reverse the list correctly', () => {
      // Act
      list.append(1).append(2).append(3).reverse();

      // Act and Assert
      expect(list.head!.toString()).toBe('3');
      expect(list.tail!.toString()).toBe('1');
      expect(list.toString()).toEqual('3,2,1');
    });
  });

  describe('insertAt method', () => {
    it('should throw exception if index less than list length', () => {
      // Act
      const result = () => list.insertAt(1, -1);

      // Assert
      expect(result).toThrow('Index `-1` out of range.');
    });

    it('should throw exception if index greater than list length', () => {
      // Act
      const result = () => list.insertAt(1, 10);

      // Assert
      expect(result).toThrow('Index `10` out of range.');
    });

    it('should insert at index 0 correctly', () => {
      // Act and Assert
      expect(list.length).toBe(0);
      expect(list.toString()).toBe('');

      // Act
      list.append(1);

      // Act and Assert
      expect(list.toString()).toBe('1');
      expect(list.length).toBe(1);

      // Act
      list.insertAt(0, 0);

      // Act and Assert
      expect(list.head!.toString()).toBe('0');
      expect(list.tail!.toString()).toBe('1');
      expect(list.toString()).toBe('0,1');
      expect(list.length).toBe(2);
    });

    it('should insert at index equal to length of list correctly', () => {
      list.append(1);
      expect(list.toString()).toBe('1');
      expect(list.length).toBe(1);

      list.insertAt(2, 1);
      expect(list.head!.toString()).toBe('1');
      expect(list.tail!.toString()).toBe('2');
      expect(list.toString()).toBe('1,2');
      expect(list.length).toBe(2);
    });

    it('should insert at the beginning of the list correctly', () => {
      list.append(1).append(2).append(3);
      expect(list.toString()).toBe('1,2,3');
      expect(list.length).toBe(3);

      list.insertAt(0, 0);
      expect(list.head!.toString()).toBe('0');
      expect(list.tail!.toString()).toBe('3');
      expect(list.toString()).toBe('0,1,2,3');
      expect(list.length).toBe(4);
    });

    it('should insert at the end of the list correctly', () => {
      list.append(1).append(2).append(3);
      expect(list.toString()).toBe('1,2,3');
      expect(list.length).toBe(3);

      list.insertAt(4, 3);
      expect(list.head!.toString()).toBe('1');
      expect(list.tail!.toString()).toBe('4');
      expect(list.toString()).toBe('1,2,3,4');
      expect(list.length).toBe(4);
    });

    it('should insert in the middle of list correctly', () => {
      list.append(1).append(2).append(4);
      expect(list.toString()).toBe('1,2,4');
      expect(list.length).toBe(3);

      list.insertAt(3, 2);
      expect(list.head!.toString()).toBe('1');
      expect(list.tail!.toString()).toBe('4');
      expect(list.toString()).toBe('1,2,3,4');
      expect(list.length).toBe(4);
    });
  });

  describe('delete method', () => {
    it('should delete node from an empty list correctly', () => {
      // Act and Assert
      expect(list.isEmpty()).toBeTruthy();
      expect(list.delete(5)).toBeNull();
      expect(list.isEmpty()).toBeTruthy();
    });

    it('should delete the first element correctly', () => {
      // Act
      list.append(1).append(2).append(3);

      // Act and Assert
      expect(list.length).toBe(3);

      // Arrange and Act
      const deletedNode = list.delete(1) as LinkedListNode<number>;

      // Assert
      expect(deletedNode.toString()).toBe('1');
      expect(list.head!.toString()).toBe('2');
      expect(list.tail!.toString()).toBe('3');
      expect(list.toString()).toEqual('2,3');
      expect(list.length).toBe(2);
    });

    it('should delete the last element correctly', () => {
      // Act
      list.append(1).append(2).append(3);

      // Arrange and Act
      const deletedElement = list.delete(3) as LinkedListNode<number>;

      // Act and Assert
      expect(deletedElement.toString()).toBe('3');
      expect(list.head!.toString()).toBe('1');
      expect(list.tail!.toString()).toBe('2');
      expect(list.toString()).toBe('1,2');
      expect(list.length).toBe(2);
    });

    it('should delete an element in the middle correctly', () => {
      // Act
      list.append(1).append(2).append(3).append(4);

      // Arrange and Act
      const deletedElement = list.delete(2) as LinkedListNode<number>;

      // Act and Assert
      expect(deletedElement.toString()).toBe('2');
      expect(list.head!.toString()).toBe('1');
      expect(list.tail!.toString()).toBe('4');
      expect(list.toString()).toBe('1,3,4');
      expect(list.length).toBe(3);
    });

    it('should delete the only element correctly', () => {
      // Act
      list.append(1);

      // Arrange and Act
      const deletedElement = list.delete(1) as LinkedListNode<number>;

      // Act and Assert
      expect(deletedElement.toString()).toBe('1');
      expect(list.isEmpty()).toBeTruthy();
    });

    it('should delete the element not in the list correctly', () => {
      // Act
      list.append(1).append(2);

      // Arrange and Act
      const deletedElement = list.delete(3);

      // Act and Assert
      expect(deletedElement).toBeNull();
      expect(list.head!.toString()).toBe('1');
      expect(list.tail!.toString()).toBe('2');
      expect(list.toString()).toBe('1,2');
      expect(list.length).toBe(2);
    });
  });

  describe('find method', () => {
    // Arrange
    beforeEach(() => {
      list.append(1).append(2).append(3);
    });

    it('should return null for empty list', () => {
      // Arrange
      const emptyList = new LinkedList();

      // Act and Assert
      expect(emptyList.find({ data: 1 })).toBeNull();
    });

    it('should find node by value', () => {
      // Arrange
      const node = list.find({ data: 2 }) as LinkedListNode<number>;

      // Act and Assert
      expect(node.toString()).toBe('2');
    });

    it('should find node by callback', () => {
      // Arrange
      const foundedNode = list.find({
        callback: (data) => data > 1,
      });

      // Act and Assert
      expect(foundedNode!.toString()).toBe('2');
    });

    it('should return null if node not found by value or callback', () => {
      // Act and Arrange
      expect(list.find({ data: 3 })).toBeNull();
    });

    it('should should prioritize callback over value', () => {
      // Arrange
      const node = list.find({
        data: 1,
        callback: (data) => data > 1,
      });

      // Act and Assert
      expect(node!.toString()).toBe('2');
    });
  });

  describe('deleteHead method', () => {
    it('should delete head of list with multiple nodes', () => {
      // Act
      list.append(1).append(2).append(3);

      // Arrange and Act
      const deletedHead = list.deleteHead();

      // Act and Assert
      expect(deletedHead!.toString()).toBe('1');
      expect(list.head!.toString()).toBe('2');
      expect(list.tail!.toString()).toBe('3');
    });

    it('should delete head of list with one node', () => {
      // Act
      list.append(1);

      // Act and Assert
      expect(list.deleteHead()!.toString()).toBe('1');
      expect(list.head).toBeNull();
      expect(list.tail).toBeNull();
      expect(list.length).toBe(0);
    });

    it('should return null for empty list', () => {
      // Arrange
      const emptyList = new LinkedList();

      // Act and Assert
      expect(emptyList.deleteHead()).toBeNull();
      expect(list.head).toBeNull();
      expect(list.tail).toBeNull();
      expect(list.length).toBe(0);
    });
  });

  describe('deleteTail method', () => {
    it('should return null if the list is empty', () => {
      // Arrange
      const emptyList = new LinkedList<number>();

      // Act and Assert
      expect(emptyList.deleteTail()).toBeNull();
    });

    it('should remove the only node and update both head and tail properties', () => {
      // Act
      list.append(1);

      // Act and Assert
      expect(list.head!.toString()).toBe('1');
      expect(list.tail!.toString()).toBe('1');
      expect(list.deleteTail()!.toString()).toBe('1');
      expect(list.head).toBeNull();
      expect(list.tail).toBeNull();
      expect(list.isEmpty());
    });

    it('should remove the tail node and update the tail property', () => {
      // Act
      list.append(1).append(2).append(3);

      // Act and Assert
      expect(list.tail!.toString()).toBe('3');
      expect(list.length).toBe(3);

      expect(list.deleteTail()!.toString()).toBe('3');
      expect(list.tail!.toString()).toBe('2');
      expect(list.length).toBe(2);

      expect(list.deleteTail()!.toString()).toBe('2');
      expect(list.tail!.toString()).toBe('1');
      expect(list.length).toBe(1);
    });
  });
});
