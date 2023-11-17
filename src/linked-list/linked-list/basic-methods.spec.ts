import { describe, beforeEach, it, expect } from 'bun:test';
import { LinkedList } from './linked-list';
// import { LinkedListNode } from '../linked-list-node';

describe('LinkedList', () => {
  // @ts-expect-error
  let linkedList: LinkedList<number> = null;

  // Arrange
  beforeEach(() => {
    linkedList = new LinkedList();
  });

  it('returns the initial state of the list correctly', () => {
    // Assert
    expect(linkedList.head).toBeNull();
    expect(linkedList.tail).toBeNull();
    expect(linkedList.length).toBe(0);
  });

  describe('isEmpty', () => {
    it('returns true for the empty list', () => {
      // Assert
      expect(linkedList.isEmpty).toBeTruthy();
    });

    it('return false for the non-empty list', () => {
      linkedList.append(1);

      expect(linkedList.isEmpty).toBeFalsy();
    });
  });

  describe('Basic methods', () => {
    describe('toArray', () => {
      it('returns an empty array for the empty list', () => {
        // Act and Assert
        expect(linkedList.toArray()).toEqual([]);
        expect(linkedList.head).toBeNull();
        expect(linkedList.tail).toBeNull();
        expect(linkedList.length).toBe(0);
      });
    });

    describe('toString', () => {
      it('returns an empty string for the empty list', () => {
        // Act and Assert
        expect(linkedList.toString()).toBe('');
        expect(linkedList.head).toBeNull();
        expect(linkedList.tail).toBeNull();
        expect(linkedList.length).toBe(0);
      });
    });

    describe('append', () => {
      it('appends node to the empty list', () => {
        // Arrange
        linkedList.append(1);

        // Act and Assert
        expect(linkedList.head?.toString()).toBe('1');
        expect(linkedList.tail?.toString()).toBe('1');
        expect(linkedList.length).toBe(1);
      });

      it('appends nodes to the non-empty list', () => {
        // Act
        linkedList.append(1);
        linkedList.append(2);

        // Assert
        expect(linkedList.head?.toString()).toBe('1');
        expect(linkedList.tail?.toString()).toBe('2');
        expect(linkedList.length).toBe(2);
        expect(linkedList.toString()).toBe('1,2');
        expect(linkedList.tail?.next).toBeNull();
      });

      it('can be used in a call chain', () => {
        // Act
        linkedList.append(1).append(2).append(3);

        expect(linkedList.toString()).toBe('1,2,3');
        expect(linkedList.length).toBe(3);
      });
    });

    describe('prepend', () => {
      it('prepends a new node to the beginning of the empty list', () => {
        // Act
        linkedList.prepend(1);

        // Assert
        expect(linkedList.toString()).toBe('1');
        expect(linkedList.head?.toString()).toBe('1');
        expect(linkedList.tail?.toString()).toBe('1');
        expect(linkedList.tail?.next).toBeNull();
        expect(linkedList.length).toBe(1);
      });

      it('prepends a new node to the beginning of a non-empty list', () => {
        // Arrange
        linkedList.append(2).append(3);

        // Act
        linkedList.prepend(1);

        // Assert
        expect(linkedList.toString()).toBe('1,2,3');
        expect(linkedList.head?.toString()).toBe('1');
        expect(linkedList.tail?.toString()).toBe('3');
        expect(linkedList.tail?.next).toBeNull();
        expect(linkedList.length).toBe(3);
      });

      it('can be used in a call chain', () => {
        // Act
        linkedList.append(1).prepend(2);

        // Assert
        expect(linkedList.length).toBe(2);
        expect(linkedList.head?.value).toBe(2);
        expect(linkedList.tail?.value).toBe(1);
        expect(linkedList.tail?.next).toBeNull();
      });
    });

    describe('delete', () => {
      it('returns node from the empty list', () => {
        // Act
        expect(linkedList.delete(5)).toBeNull();

        // Assert
        expect(linkedList.head).toBeNull();
        expect(linkedList.tail).toBeNull();
        expect(linkedList.length).toBe(0);
      });

      it('deletes the element outside the list', () => {
        // Arrange
        linkedList.append(1).append(2);

        // Act
        const deletedElement = linkedList.delete(3);

        // Assert
        expect(deletedElement).toBeNull();
        expect(linkedList.head?.toString()).toBe('1');
        expect(linkedList.tail?.toString()).toBe('2');
        expect(linkedList.toString()).toBe('1,2');
        expect(linkedList.length).toBe(2);
      });

      it('deletes the node from the singular node list', () => {
        // Arrange
        linkedList.append(1);

        // Act
        const deletedElement = linkedList.delete(1)!;

        // Assert
        expect(deletedElement.toString()).toBe('1');
        expect(linkedList.head).toBeNull();
        expect(linkedList.tail).toBeNull();
        expect(linkedList.length).toBe(0);
      });

      it('deletes the first node from the multi-node list', () => {
        // Arrange
        linkedList.append(1).append(2).append(3);
        expect(linkedList.length).toBe(3);

        // Act
        const deletedNode = linkedList.delete(1)!;

        // Assert
        expect(deletedNode.toString()).toBe('1');
        expect(linkedList.head?.toString()).toBe('2');
        expect(linkedList.tail?.toString()).toBe('3');
        expect(linkedList.toString()).toEqual('2,3');
        expect(linkedList.length).toBe(2);
      });

      it('deletes an element in the middle', () => {
        // Arrange
        linkedList.append(1).append(2).append(3).append(4);

        // Act
        const deletedElement = linkedList.delete(2)!;

        // Assert
        expect(deletedElement.toString()).toBe('2');
        expect(linkedList.head?.toString()).toBe('1');
        expect(linkedList.tail?.toString()).toBe('4');
        expect(linkedList.toString()).toBe('1,3,4');
        expect(linkedList.length).toBe(3);
      });

      it('deletes the last element', () => {
        // Arrange
        linkedList.append(1).append(2).append(3);

        // Act
        const deletedElement = linkedList.delete(3)!;

        // Assert
        expect(deletedElement.toString()).toBe('3');
        expect(linkedList.head?.toString()).toBe('1');
        expect(linkedList.tail?.toString()).toBe('2');
        expect(linkedList.toString()).toBe('1,2');
        expect(linkedList.length).toBe(2);
      });
    });

    describe('reverse', () => {
      it('reverses the empty list', () => {
        // Act
        linkedList.reverse();

        // Assert
        expect(linkedList.toString()).toBe('');
        expect(linkedList.head).toBeNull();
        expect(linkedList.tail).toBeNull();
        expect(linkedList.toString()).toBe('');
        expect(linkedList.length).toBe(0);
      });

      it('it reverses the head of the singular node list', () => {
        // Arrange
        linkedList.append(1);

        // Act
        linkedList.reverse();

        // Assert
        expect(linkedList.head?.toString()).toBe('1');
        expect(linkedList.tail?.toString()).toBe('1');
        expect(linkedList.toString()).toBe('1');
      });

      it('reverses the list', () => {
        // Arrange
        linkedList.append(1).append(2).append(3);

        // Act
        linkedList.reverse();

        // Assert
        expect(linkedList.head?.toString()).toBe('3');
        expect(linkedList.tail?.toString()).toBe('1');
        expect(linkedList.toString()).toEqual('3,2,1');
        expect(linkedList.length).toBe(3);
      });

      it('can be used in a call chain', () => {
        // Arrange
        linkedList.append(1).append(2).append(3);

        // Act
        linkedList.reverse().append(4);

        // Assert
        expect(linkedList.head?.toString()).toBe('3');
        expect(linkedList.tail?.toString()).toBe('4');
        expect(linkedList.toString()).toBe('3,2,1,4');
        expect(linkedList.length).toBe(4);
      });
    });

    describe('insertAt', () => {
      it('throws exception if index less than list length', () => {
        // Act
        const result = () =>
          linkedList.insertAt({
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
          linkedList.insertAt({
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
        expect(linkedList.length).toBe(0);
        expect(linkedList.toString()).toBe('');

        // Act
        linkedList.append(1);

        // Assert
        expect(linkedList.toString()).toBe('1');
        expect(linkedList.length).toBe(1);

        // Act
        linkedList.insertAt({
          value: 0,
          index: 0,
        });

        // Assert
        expect(linkedList.head?.toString()).toBe('0');
        expect(linkedList.tail?.toString()).toBe('1');
        expect(linkedList.toString()).toBe('0,1');
        expect(linkedList.length).toBe(2);
      });

      it('inserts in the middle of the list', () => {
        // Arrange
        linkedList.append(1).append(2);

        // Act
        linkedList.append(4);

        // Assert
        expect(linkedList.toString()).toBe('1,2,4');
        expect(linkedList.length).toBe(3);

        // Act
        linkedList.insertAt({
          index: 2,
          value: 3,
        });

        // Assert
        expect(linkedList.head?.toString()).toBe('1');
        expect(linkedList.tail?.toString()).toBe('4');
        expect(linkedList.toString()).toBe('1,2,3,4');
        expect(linkedList.length).toBe(4);
      });

      it('inserts at the end of the list', () => {
        // Arrange
        expect(linkedList.length).toBe(0);
        expect(linkedList.toString()).toBe('');

        // Act
        linkedList.append(1);

        // Assert
        expect(linkedList.toString()).toBe('1');
        expect(linkedList.length).toBe(1);

        // Act
        linkedList.insertAt({
          value: 2,
          index: 1,
        });

        // Assert
        expect(linkedList.head?.toString()).toBe('1');
        expect(linkedList.tail?.toString()).toBe('2');
        expect(linkedList.toString()).toBe('1,2');
        expect(linkedList.length).toBe(2);
      });

      it('can be used in a call chain', () => {
        // Arrange
        expect(linkedList.length).toBe(0);
        expect(linkedList.head).toBeNull();
        expect(linkedList.tail).toBeNull();

        // Act
        linkedList
          .insertAt({
            index: 0,
            value: 1,
          })
          .insertAt({
            index: 1,
            value: 2,
          });

        // Assert
        expect(linkedList.length).toBe(2);
        expect(linkedList.toString()).toBe('1,2');
        expect(linkedList.head?.toString()).toBe('1');
        expect(linkedList.tail?.toString()).toBe('2');
      });
    });

    describe('deleteHead', () => {
      it('deletes the head from an empty list', () => {
        // Act and Assert
        expect(linkedList.deleteHead()).toBeNull();
        expect(linkedList.head).toBeNull();
        expect(linkedList.tail).toBeNull();
        expect(linkedList.length).toBe(0);
      });

      it('deletes the head from the list with multiple nodes', () => {
        // Arrange
        linkedList.append(1).append(2).append(3);

        // Act
        const deletedHead = linkedList.deleteHead();

        expect(deletedHead?.toString()).toBe('1');
        expect(linkedList.head?.toString()).toBe('2');
        expect(linkedList.tail?.toString()).toBe('3');
        expect(linkedList.length).toBe(2);
      });
    });

    describe('deleteTail', () => {
      it('deletes the tail from an empty list', () => {
        // Act and Assert
        expect(linkedList.deleteTail()).toBeNull();
        expect(linkedList.head).toBeNull();
        expect(linkedList.tail).toBeNull();
        expect(linkedList.length).toBe(0);
      });

      it('deletes the tail form the list with a single node', () => {
        linkedList.append(1);

        const deletedTail = linkedList.deleteTail();

        expect(deletedTail?.toString()).toBe('1');
        expect(linkedList.head).toBeNull();
        expect(linkedList.tail).toBeNull();
        expect(linkedList.length).toBe(0);
      });

      it('deletes the tail from the list with multiple nodes', () => {
        // Arrange
        linkedList.append(1).append(2).append(3);

        // Act
        const deletedTail = linkedList.deleteTail();

        // Assert
        expect(deletedTail?.toString()).toBe('3');
        expect(linkedList.head?.toString()).toBe('1');
        expect(linkedList.tail?.toString()).toBe('2');
      });
    });
  });
});
