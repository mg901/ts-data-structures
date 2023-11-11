import { describe, beforeEach, test, expect } from 'bun:test';
import { LinkedList } from '../linked-list';
import { LinkedListNode } from '../../linked-list-node';

describe('LinkedList', () => {
  // @ts-expect-error
  let list: LinkedList<number> = null;

  // Arrange
  beforeEach(() => {
    list = new LinkedList();
  });

  describe('Basic methods', () => {
    describe('toArray', () => {
      test('returns an empty array for an empty list', () => {
        // Act and Assert
        expect(list.toArray()).toEqual([]);
      });

      test('returns an array with the same values as the list', () => {
        // Arrange
        list.append(1).append(2).append(3);

        // Act
        const receivedString = list.toArray().join(',');

        // Act and Assert
        expect(receivedString).toBe('1,2,3');
      });
    });

    describe('toString', () => {
      test('returns an empty string for an empty list', () => {
        // Act and Assert
        expect(list.toString()).toBe('');
      });

      test('returns a string representation of the list', () => {
        // Arrange
        list.append(1).append(2).append(3);

        // Assert
        expect(list.toString()).toBe('1,2,3');
      });
    });

    describe('append', () => {
      test('appends node correctly to the empty list', () => {
        // Act and Assert
        expect(list.isEmpty).toBeTruthy();
        expect(list.head).toBeNull();
        expect(list.tail).toBeNull();

        // Arrange
        list.append(1);

        // Act and Assert
        expect(list.head?.toString()).toBe('1');
        expect(list.tail?.toString()).toBe('1');
        expect(list.length).toBe(1);
      });

      test('appends correctly node to the non-empty list', () => {
        // Arrange
        list.append(1).append(2);

        // Act and Assert
        expect(list.length).toBe(2);
        expect(list.head?.toString()).toBe('1');
        expect(list.tail?.toString()).toBe('2');
        expect(list.toString()).toBe('1,2');
        expect(list.tail?.next).toBeNull();
      });
    });

    describe('prepend', () => {
      test('prepends a new node to the beginning of an empty list', () => {
        // Act and Assert
        expect(list.isEmpty).toBeTruthy();

        // Act
        list.prepend(1);

        // Act and Assert
        expect(list.toString()).toBe('1');
        expect(list.head?.toString()).toBe('1');
        expect(list.tail?.toString()).toBe('1');
        expect(list.tail?.next).toBeNull();
        expect(list.length).toBe(1);
      });

      test('add nesw node to the beginning of a non-empty list', () => {
        // Act
        list.append(2).append(3).prepend(1);

        // Act and Assert
        expect(list.toString()).toBe('1,2,3');
        expect(list.head?.toString()).toBe('1');
        expect(list.tail?.toString()).toBe('3');
        expect(list.tail?.next).toBeNull();
        expect(list.length).toBe(3);
      });

      test('prepends node to the lined list', () => {
        // Arrange
        const list: LinkedList = new LinkedList();

        // Assert
        expect(list.isEmpty).toBeTruthy();
        expect(list.head).toBeNull();
        expect(list.tail).toBeNull();

        // Act
        list.append(1).prepend(2);

        // Assert
        expect(list.length).toBe(2);
        expect(list.head?.toString()).toBe('2');
        expect(list.tail?.toString()).toBe('1');
        expect(list.tail?.next).toBeNull();
      });
    });

    describe('reverse', () => {
      test('reverses the empty list correctly', () => {
        // Act
        list.reverse();

        // Act and Assert
        expect(list.toString()).toBe('');
      });

      test('reverses the list with a single element correctly', () => {
        // Act
        list.append(1).reverse();

        // Act and Assert
        expect(list.head?.toString()).toBe('1');
        expect(list.tail?.toString()).toBe('1');
        expect(list.toString()).toBe('1');
      });

      test('reverses the list correctly', () => {
        // Act
        list.append(1).append(2).append(3).reverse();

        // Act and Assert
        expect(list.head?.toString()).toBe('3');
        expect(list.tail?.toString()).toBe('1');
        expect(list.toString()).toEqual('3,2,1');
      });
    });

    describe('delete', () => {
      test('deletes node from an empty list correctly', () => {
        // Act and Assert
        expect(list.isEmpty).toBeTruthy();
        expect(list.delete(5)).toBeNull();
        expect(list.isEmpty).toBeTruthy();
      });

      test('deletes the first element correctly', () => {
        // Act
        list.append(1).append(2).append(3);

        // Act and Assert
        expect(list.length).toBe(3);

        // Arrange and Act
        const deletedNode = list.delete(1) as LinkedListNode<number>;

        // Assert
        expect(deletedNode.toString()).toBe('1');
        expect(list.head?.toString()).toBe('2');
        expect(list.tail?.toString()).toBe('3');
        expect(list.toString()).toEqual('2,3');
        expect(list.length).toBe(2);
      });

      test('deletes the last element correctly', () => {
        // Act
        list.append(1).append(2).append(3);

        // Arrange and Act
        const deletedElement = list.delete(3) as LinkedListNode<number>;

        // Act and Assert
        expect(deletedElement.toString()).toBe('3');
        expect(list.head?.toString()).toBe('1');
        expect(list.tail?.toString()).toBe('2');
        expect(list.toString()).toBe('1,2');
        expect(list.length).toBe(2);
      });

      test('deletes an element in the middle correctly', () => {
        // Act
        list.append(1).append(2).append(3).append(4);

        // Arrange and Act
        const deletedElement = list.delete(2) as LinkedListNode<number>;

        // Act and Assert
        expect(deletedElement.toString()).toBe('2');
        expect(list.head?.toString()).toBe('1');
        expect(list.tail?.toString()).toBe('4');
        expect(list.toString()).toBe('1,3,4');
        expect(list.length).toBe(3);
      });

      test('deletes the only element correctly', () => {
        // Act
        list.append(1);

        // Arrange and Act
        const deletedElement = list.delete(1) as LinkedListNode<number>;

        // Act and Assert
        expect(deletedElement.toString()).toBe('1');
        expect(list.isEmpty).toBeTruthy();
      });

      test('deletes the element not in the list correctly', () => {
        // Act
        list.append(1).append(2);

        // Arrange and Act
        const deletedElement = list.delete(3);

        // Act and Assert
        expect(deletedElement).toBeNull();
        expect(list.head?.toString()).toBe('1');
        expect(list.tail?.toString()).toBe('2');
        expect(list.toString()).toBe('1,2');
        expect(list.length).toBe(2);
      });
    });

    describe('insertAt', () => {
      test('throws exception if index less than list length', () => {
        // Act
        const result = () =>
          list.insertAt({
            data: 1,
            index: -1,
          });

        // Assert
        expect(result).toThrow(
          'Index should be greater than or equal to 0 and less than or equal to the list length.',
        );
      });

      test('throws exception if index greater than list length', () => {
        // Act
        const result = () =>
          list.insertAt({
            data: 1,
            index: 10,
          });

        // Assert
        expect(result).toThrow(
          'Index should be greater than or equal to 0 and less than or equal to the list length.',
        );
      });

      test('inserts at index 0 correctly', () => {
        // Act and Assert
        expect(list.length).toBe(0);
        expect(list.toString()).toBe('');

        // Act
        list.append(1);

        // Act and Assert
        expect(list.toString()).toBe('1');
        expect(list.length).toBe(1);

        // Act
        list.insertAt({
          data: 0,
          index: 0,
        });

        // Act and Assert
        expect(list.head?.toString()).toBe('0');
        expect(list.tail?.toString()).toBe('1');
        expect(list.toString()).toBe('0,1');
        expect(list.length).toBe(2);
      });

      test('inserts at index equal to length of list correctly', () => {
        // Arrange and Act
        list.append(1);

        // Assert
        expect(list.toString()).toBe('1');
        expect(list.length).toBe(1);

        // Act
        list.insertAt({
          data: 2,
          index: 1,
        });

        // Act and Assert
        expect(list.head?.toString()).toBe('1');
        expect(list.tail?.toString()).toBe('2');
        expect(list.toString()).toBe('1,2');
        expect(list.length).toBe(2);
      });

      test('inserts at the beginning of the list correctly', () => {
        // Arrange and Act
        list.append(1).append(2).append(3);

        // Act and Assert
        expect(list.toString()).toBe('1,2,3');
        expect(list.length).toBe(3);

        // Act
        list.insertAt({
          data: 0,
          index: 0,
        });

        // Act and Assert
        expect(list.head?.toString()).toBe('0');
        expect(list.tail?.toString()).toBe('3');
        expect(list.toString()).toBe('0,1,2,3');
        expect(list.length).toBe(4);
      });

      test('inserts at the end of the list correctly', () => {
        // Arrange and Act
        list.append(1).append(2).append(3);

        // Act and Assert
        expect(list.toString()).toBe('1,2,3');
        expect(list.length).toBe(3);

        // Act
        list.insertAt({
          data: 4,
          index: 3,
        });

        // Act and Assert
        expect(list.head?.toString()).toBe('1');
        expect(list.tail?.toString()).toBe('4');
        expect(list.toString()).toBe('1,2,3,4');
        expect(list.length).toBe(4);
      });

      test('inserts in the middle of list correctly', () => {
        // Arrange and Act
        list.append(1).append(2).append(4);

        // Act and Assert
        expect(list.toString()).toBe('1,2,4');
        expect(list.length).toBe(3);

        // Act
        list.insertAt({
          data: 3,
          index: 2,
        });

        // Act and Assert
        expect(list.head?.toString()).toBe('1');
        expect(list.tail?.toString()).toBe('4');
        expect(list.toString()).toBe('1,2,3,4');
        expect(list.length).toBe(4);
      });
    });

    describe('deleteHead', () => {
      test('deletes head of list with multiple nodes', () => {
        // Arrange
        list.append(1).append(2).append(3);
        const deletedHead = list.deleteHead();

        // Act and Assert
        expect(deletedHead?.toString()).toBe('1');
        expect(list.head?.toString()).toBe('2');
        expect(list.tail?.toString()).toBe('3');
        expect(list.length).toBe(2);
      });

      test('deletes head of list with one node', () => {
        // Arrange
        list.append(1);

        // Act and Assert
        expect(list.deleteHead()?.toString()).toBe('1');
        expect(list.head).toBeNull();
        expect(list.tail).toBeNull();
        expect(list.length).toBe(0);
      });

      test('returns null for empty list', () => {
        // Act and Assert
        expect(list.deleteHead()).toBeNull();
        expect(list.head).toBeNull();
        expect(list.tail).toBeNull();
        expect(list.length).toBe(0);
      });
    });

    describe('deleteTail', () => {
      test('returns null if the list is empty', () => {
        // Act and Assert
        expect(list.deleteTail()).toBeNull();
      });

      test('removes the only node and update both head and tail properties', () => {
        // Arrange
        list.append(1);

        // Act
        const deletedTail = list.deleteTail();

        // Act and Assert
        expect(deletedTail?.toString()).toBe('1');
        expect(list.head).toBeNull();
        expect(list.tail).toBeNull();
        expect(list.isEmpty).toBeTruthy();
      });

      test('removes the tail node and update the tail property', () => {
        // Arrange
        list.append(1).append(2).append(3);

        // Act and Assert
        expect(list.tail?.toString()).toBe('3');
        expect(list.length).toBe(3);

        expect(list.deleteTail()?.toString()).toBe('3');
        expect(list.tail?.toString()).toBe('2');
        expect(list.length).toBe(2);

        expect(list.deleteTail()?.toString()).toBe('2');
        expect(list.tail?.toString()).toBe('1');
        expect(list.length).toBe(1);
      });
    });
  });
});
