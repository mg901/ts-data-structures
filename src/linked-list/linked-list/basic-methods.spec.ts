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
      it('appends node correctly to the empty list', () => {
        // Act and Assert
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

      it('correctly appends nodes to the non-empty list', () => {
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
      it('prepends a new node to the beginning of an empty list', () => {
        // Act and Assert
        expect(list.isEmpty).toBeTruthy();

        // Arrange
        list.prepend(1);

        // Act and Assert
        expect(list.toString()).toBe('1');
        expect(list.head?.toString()).toBe('1');
        expect(list.tail?.toString()).toBe('1');
        expect(list.tail?.next).toBeNull();
        expect(list.length).toBe(1);
      });

      it('add new node to the beginning of a non-empty list', () => {
        // Act
        list.append(2).append(3).prepend(1);

        // Act and Assert
        expect(list.toString()).toBe('1,2,3');
        expect(list.head?.toString()).toBe('1');
        expect(list.tail?.toString()).toBe('3');
        expect(list.tail?.next).toBeNull();
        expect(list.length).toBe(3);
      });

      it('prepends nodes to the lined list', () => {
        // Assert
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
      it('reverses the empty list correctly', () => {
        // Act
        list.reverse();

        // Act and Assert
        expect(list.toString()).toBe('');
      });

      it('reverses the list with a single element correctly', () => {
        // Arrange
        list.append(1).reverse();

        // Act and Assert
        expect(list.head?.toString()).toBe('1');
        expect(list.tail?.toString()).toBe('1');
        expect(list.toString()).toBe('1');
      });

      it('reverses the list correctly', () => {
        // Arrange
        list.append(1).append(2).append(3).reverse();

        // Act and Assert
        expect(list.head?.toString()).toBe('3');
        expect(list.tail?.toString()).toBe('1');
        expect(list.toString()).toEqual('3,2,1');
      });
    });

    describe('delete', () => {
      it('deletes node from an empty list correctly', () => {
        // Act and Assert
        expect(list.isEmpty).toBeTruthy();
        expect(list.delete(5)).toBeNull();
        expect(list.isEmpty).toBeTruthy();
      });

      it('deletes the first element correctly', () => {
        // Arrange
        list.append(1).append(2).append(3);

        // Act and Assert
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
  });
});
