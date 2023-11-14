import { describe, beforeEach, it, expect } from 'bun:test';
import { LinkedList } from './linked-list';
// import { LinkedListNode } from '../linked-list-node';

describe('LinkedList', () => {
  // @ts-expect-error
  let list: LinkedList<number> = null;

  // Arrange
  beforeEach(() => {
    list = new LinkedList();
  });

  describe('Basic methods', () => {
    describe('isEmpty', () => {
      it('returns `false` for an empty list', () => {
        expect(list).toBeTruthy();
      });
    });

    describe('toArray', () => {
      it('returns an empty array for an empty list', () => {
        // Act and Assert
        expect(list.toArray()).toEqual([]);
      });

      it('returns an array with the same values as the list', () => {
        // Arrange
        list.append(1).append(2).append(3);

        // Act
        const receivedString = list.toArray().join(',');

        // Act and Assert
        expect(receivedString).toBe('1,2,3');
      });
    });

    describe('toString', () => {
      it('returns an empty string for an empty list', () => {
        // Act and Assert
        expect(list.toString()).toBe('');
      });

      it('returns a string representation of the list', () => {
        // Arrange
        list.append(1).append(2).append(3);

        // Assert
        expect(list.toString()).toBe('1,2,3');
      });
    });

    describe('append', () => {
      it('appends node to the empty list', () => {
        // Arrange
        expect(list.isEmpty).toBeTruthy();
        expect(list.head).toBeNull();
        expect(list.tail).toBeNull();

        // Arrange
        list.append(1);

        // Act and Assert
        expect(list.head?.value).toBe(1);
        expect(list.tail?.value).toBe(1);
        expect(list.length).toBe(1);
      });

      it('appends nodes to the non-empty list', () => {
        // Act
        list.append(1);
        list.append(2);

        // Assert
        expect(list.length).toBe(2);
        expect(list.head?.toString()).toBe('1');
        expect(list.tail?.toString()).toBe('2');
        expect(list.toString()).toBe('1,2');
        expect(list.tail?.next).toBeNull();
      });

      it('can be used in a call chain', () => {
        // Act
        list.append(1).append(2).append(3);

        expect(list.toString()).toBe('1,2,3');
        expect(list.length).toBe(3);
      });
    });

    describe('prepend', () => {
      it('prepends a new node to the beginning of an empty list', () => {
        // Arrange
        expect(list.isEmpty).toBeTruthy();

        // Act
        list.prepend(1);

        // Assert
        expect(list.toString()).toBe('1');
        expect(list.head?.toString()).toBe('1');
        expect(list.tail?.toString()).toBe('1');
        expect(list.tail?.next).toBeNull();
        expect(list.length).toBe(1);
      });

      it('prepends a new node to the beginning of a non-empty list', () => {
        // Arrange
        list.append(2).append(3);

        // Act
        list.prepend(1);

        // Assert
        expect(list.toString()).toBe('1,2,3');
        expect(list.head?.toString()).toBe('1');
        expect(list.tail?.toString()).toBe('3');
        expect(list.tail?.next).toBeNull();
        expect(list.length).toBe(3);
      });

      it('prepends nodes to the linked list', () => {
        // Arrange
        expect(list.isEmpty).toBeTruthy();
        expect(list.head).toBeNull();
        expect(list.tail).toBeNull();

        // Act
        list.append(1).prepend(2);

        // Assert
        expect(list.length).toBe(2);
        expect(list.head?.value).toBe(2);
        expect(list.tail?.value).toBe(1);
        expect(list.tail?.next).toBeNull();
      });
    });

    describe('reverse', () => {
      it('reverses the empty list', () => {
        // Act
        list.reverse();

        // Assert
        expect(list.toString()).toBe('');
      });

      it('reverses the list with a single element', () => {
        // Arrange
        list.append(1);

        // Act
        list.reverse();

        // Assert
        expect(list.head?.toString()).toBe('1');
        expect(list.tail?.toString()).toBe('1');
        expect(list.toString()).toBe('1');
      });

      it('reverses the list', () => {
        // Arrange
        list.append(1).append(2).append(3);

        // Act
        list.reverse();

        // Assert
        expect(list.head?.toString()).toBe('3');
        expect(list.tail?.toString()).toBe('1');
        expect(list.toString()).toEqual('3,2,1');
      });

      it('can be used in a call chain', () => {
        // Arrange
        list.append(1).append(2).append(3);

        // Act
        list.reverse().append(4);

        // Assert
        expect(list.head?.toString()).toBe('3');
        expect(list.tail?.toString()).toBe('4');
        expect(list.toString()).toBe('3,2,1,4');
        expect(list.length).toBe(4);
      });
    });

    describe('delete', () => {
      it('deletes node from an empty list correctly', () => {
        // Arrange
        expect(list.isEmpty).toBeTruthy();

        // Act
        expect(list.delete(5)).toBeNull();

        // Assert
        expect(list.isEmpty).toBeTruthy();
      });

      it('deletes the first element correctly', () => {
        // Arrange
        list.append(1).append(2).append(3);
        expect(list.length).toBe(3);

        // Act
        const deletedNode = list.delete(1)!;

        // Assert
        expect(deletedNode.toString()).toBe('1');
        expect(list.head?.toString()).toBe('2');
        expect(list.tail?.toString()).toBe('3');
        expect(list.toString()).toEqual('2,3');
        expect(list.length).toBe(2);
      });

      it('deletes an element in the middle correctly', () => {
        // Arrange
        list.append(1).append(2).append(3).append(4);

        // Act
        const deletedElement = list.delete(2)!;

        // Assert
        expect(deletedElement.toString()).toBe('2');
        expect(list.head?.toString()).toBe('1');
        expect(list.tail?.toString()).toBe('4');
        expect(list.toString()).toBe('1,3,4');
        expect(list.length).toBe(3);
      });

      it('deletes the last element correctly', () => {
        // Arrange
        list.append(1).append(2).append(3);

        // Act
        const deletedElement = list.delete(3)!;

        // Assert
        expect(deletedElement.toString()).toBe('3');
        expect(list.head?.toString()).toBe('1');
        expect(list.tail?.toString()).toBe('2');
        expect(list.toString()).toBe('1,2');
        expect(list.length).toBe(2);
      });

      it('deletes the only element correctly', () => {
        // Arrange
        list.append(1);

        // Act
        const deletedElement = list.delete(1)!;

        // Assert
        expect(deletedElement.toString()).toBe('1');
        expect(list.isEmpty).toBeTruthy();
      });

      it('deletes the element not in the list correctly', () => {
        // Arrange
        list.append(1).append(2);

        // Act
        const deletedElement = list.delete(3);

        // Assert
        expect(deletedElement).toBeNull();
        expect(list.head?.toString()).toBe('1');
        expect(list.tail?.toString()).toBe('2');
        expect(list.toString()).toBe('1,2');
        expect(list.length).toBe(2);
      });
    });

    describe('insertAt', () => {
      it('throws exception if index less than list length', () => {
        // Act
        const result = () =>
          list.insertAt({
            value: 1,
            index: -1,
          });

        // Assert
        expect(result).toThrow(
          'Index should be greater than or equal to 0 and less than or equal to the list length.',
        );
      });

      it('throws exception if index greater than list length', () => {
        // Act
        const result = () =>
          list.insertAt({
            value: 1,
            index: 10,
          });

        // Assert
        expect(result).toThrow(
          'Index should be greater than or equal to 0 and less than or equal to the list length.',
        );
      });

      it('inserts at the beginning of the list', () => {
        // Arrange
        expect(list.length).toBe(0);
        expect(list.toString()).toBe('');

        // Act
        list.append(1);

        // Assert
        expect(list.toString()).toBe('1');
        expect(list.length).toBe(1);

        // Act
        list.insertAt({
          value: 0,
          index: 0,
        });

        // Assert
        expect(list.head?.toString()).toBe('0');
        expect(list.tail?.toString()).toBe('1');
        expect(list.toString()).toBe('0,1');
        expect(list.length).toBe(2);
      });

      it('inserts in the middle of the list', () => {
        // Arrange
        list.append(1).append(2);

        // Act
        list.append(4);

        // Assert
        expect(list.toString()).toBe('1,2,4');
        expect(list.length).toBe(3);

        // Act
        list.insertAt({
          index: 2,
          value: 3,
        });

        // Assert
        expect(list.head?.toString()).toBe('1');
        expect(list.tail?.toString()).toBe('4');
        expect(list.toString()).toBe('1,2,3,4');
        expect(list.length).toBe(4);
      });

      it('inserts at the end of the list', () => {
        // Arrange
        expect(list.length).toBe(0);
        expect(list.toString()).toBe('');

        // Act
        list.append(1);

        // Assert
        expect(list.toString()).toBe('1');
        expect(list.length).toBe(1);

        // Act
        list.insertAt({
          value: 2,
          index: 1,
        });

        // Assert
        expect(list.head?.toString()).toBe('1');
        expect(list.tail?.toString()).toBe('2');
        expect(list.toString()).toBe('1,2');
        expect(list.length).toBe(2);
      });

      it('can be used in a call chain', () => {
        // Arrange
        expect(list.length).toBe(0);
        expect(list.head?.toString()).toBeNull();
        expect(list.tail?.toString()).toBeNull();

        // Act
        list
          .insertAt({
            index: 0,
            value: 1,
          })
          .insertAt({
            index: 1,
            value: 2,
          });

        // Assert
        expect(list.length).toBe(2);
        expect(list.toString()).toBe('1,2');
        expect(list.head?.toString()).toBe('1');
        expect(list.tail?.toString()).toBe('2');
      });
    });
  });
});
