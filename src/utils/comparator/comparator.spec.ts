import { describe, expect, test as it } from 'vitest';
import { Comparator } from './comparator';
import type { CompareFunction } from './comparator';

describe('Comparator', () => {
  it('compares values using default comparison function', () => {
    // Arrange
    const comparator = new Comparator<number>();

    // Act and Assert
    expect(comparator.lessThan(2, 5)).toBeTruthy();
    expect(comparator.greaterThan(5, 2)).toBeTruthy();
    expect(comparator.equal(2, 2)).toBeTruthy();
    expect(comparator.lessThanOrEqual(2, 5)).toBeTruthy();
    expect(comparator.lessThanOrEqual(2, 2)).toBeTruthy();
    expect(comparator.greaterThanOrEqual(5, 2)).toBeTruthy();
    expect(comparator.greaterThanOrEqual(2, 2)).toBeTruthy();
  });

  it('uses provided compare function', () => {
    // Arrange
    const compareFunction: CompareFunction<string> = (a, b) => {
      if (a.length === b.length) return 0;

      return a.length < b.length ? -1 : 1;
    };

    // Act
    const comparator = new Comparator<string>(compareFunction);

    // Assert
    expect(comparator.lessThan('apple', 'banana')).toBeTruthy();
    expect(comparator.greaterThan('banana', 'apple')).toBeTruthy();
    expect(comparator.equal('apple', 'orange')).toBeFalsy();
  });

  it('reverses the comparison', () => {
    // Arrange
    const comparator = new Comparator<number>();

    // Act
    comparator.reverse();

    // Assert
    expect(comparator.lessThan(2, 5)).toBeFalsy();
    expect(comparator.greaterThan(5, 2)).toBeFalsy();
    expect(comparator.equal(2, 2)).toBeTruthy();
  });
});
