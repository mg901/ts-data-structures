import { describe, beforeEach, test, expect } from 'bun:test';
import { LinkedList } from '../linked-list';

describe('LinkedList', () => {
  // @ts-ignore
  let list: LinkedList<number> = null;

  // Arrange
  beforeEach(() => {
    list = new LinkedList();
  });

  describe('Additional methods', () => {
    describe('indexOf', () => {
      // Arrange
      beforeEach(() => {
        // Act
        list.append(1).append(2).append(3);
      });

      test('returns 0 if the index is at the head of the list', () => {
        // Act and Assert
        expect(list.indexOf(1)).toBe(0);
      });

      test('returns the index of the given element if it exists in the list', () => {
        // Act and Assert
        expect(list.indexOf(2)).toBe(1);
      });

      test("returns `-1` if the given element doesn't exist in the list", () => {
        // Act and Assert
        expect(list.indexOf(4)).toBe(-1);
      });

      test('returns the index of the first occurrence of the given element', () => {
        // Arrange
        list.append(2);

        // Act and Assert
        expect(list.indexOf(2)).toBe(1);
      });

      test('returns `0` if the index is at the head of the list', () => {
        // Act and Assert
        expect(list.indexOf(1)).toBe(0);
      });

      test('returns the index of the last element if the element is at the tail of the list', () => {
        // Act and Assert
        expect(list.indexOf(3)).toBe(2);
      });

      describe('on an empty list', () => {
        test('returns `-1` for any element', () => {
          // Arrange
          const emptyList = new LinkedList<number>();

          // Act and Assert
          expect(emptyList.indexOf(1)).toBe(-1);
          expect(emptyList.indexOf(2)).toBe(-1);
          expect(emptyList.indexOf(3)).toBe(-1);
        });
      });
    });

    describe('fromArray', () => {
      test('creates an empty list when an empty array is passed', () => {
        // Act
        list.fromArray([]);

        // Act and Assert
        expect(list.isEmpty).toBeTruthy();
      });

      test('creates a list with the same nodes as the input array', () => {
        // Act
        list.fromArray([1, 2, 3, 4]);

        // Act and Assert
        expect(list.toString()).toBe('1,2,3,4');
      });
    });

    describe('find', () => {
      test('returns null for an empty list', () => {
        // Act and Assert
        expect(list.find({ data: 1 })).toBeNull();
      });

      test('finds a node by value', () => {
        // Arrange
        list.append(1).append(2);
        const foundedNode = list.find({ data: 2 });

        // Act and Assert
        expect(foundedNode?.toString()).toBe('2');
      });

      test('finds a node by predicate', () => {
        // Arrange
        list.append(1).append(2).append(3);

        const foundedNode = list.find({
          predicate: (data) => data > 2,
        });

        // Act and Assert
        expect(foundedNode?.toString()).toBe('3');
      });

      test('returns null if a node is not found by value or predicate', () => {
        // Act and Assert
        expect(list.find({ data: 3 })).toBeNull();
      });

      test('prioritizes predicate over value', () => {
        // Arrange
        list.append(1).append(2);

        const foundedNode = list.find({
          predicate: (data) => data > 1,
        });

        // Act and Assert
        expect(foundedNode?.toString()).toBe('2');
      });

      test('returns the first node if multiple nodes match the predicate', () => {
        // Arrange
        list.append(1).append(2).append(3).append(4);

        const foundedNode = list.find({
          predicate: (value) => value > 1,
        });

        // Act and Assert
        expect(foundedNode?.toString()).toBe('2');
      });
    });
  });
});
