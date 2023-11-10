import { describe, expect, it } from 'bun:test';
import { Comparator } from './comparator';

describe('Comparator', () => {
  it('should compare with default comparator function', () => {
    // Arrange
    const comparator = new Comparator();

    // Act and Assert
    expect(comparator.equal(0, 0)).toBeTruthy();
    expect(comparator.equal(1, 0)).toBeFalsy();
    expect(comparator.equal('a', 'a')).toBeTruthy();
    expect(comparator.lessThan(1, 2)).toBeTruthy();
    expect(comparator.lessThan(-1, 2)).toBeTruthy();
    expect(comparator.lessThan('a', 'b')).toBeTruthy();
    expect(comparator.lessThan('a', 'ab')).toBeTruthy();
    expect(comparator.lessThan(10, 2)).toBeFalsy();
    expect(comparator.lessThanOrEqual(1, 1)).toBeTruthy();
    expect(comparator.lessThanOrEqual(0, 0)).toBeTruthy();
    expect(comparator.greaterThan(0, 0)).toBeFalsy();
    expect(comparator.greaterThan(10, 0)).toBeTruthy();
    expect(comparator.greaterThanOrEqual(10, 0)).toBeTruthy();
    expect(comparator.greaterThanOrEqual(10, 10)).toBeTruthy();
    expect(comparator.greaterThanOrEqual(0, 10)).toBeFalsy();
  });

  it('should compare with custom comparator function', () => {
    // Arrange
    const comparator = new Comparator((a: string, b: string) => {
      if (a.length === b.length) return 0;

      return a.length < b.length ? -1 : 1;
    });

    // Act and Assert
    expect(comparator.equal('a', 'b')).toBeTruthy();
    expect(comparator.equal('a', '')).toBeFalsy();
    expect(comparator.lessThan('b', 'aa')).toBeTruthy();
    expect(comparator.greaterThanOrEqual('a', 'aa')).toBeFalsy();
    expect(comparator.greaterThanOrEqual('aa', 'a')).toBeTruthy();
    expect(comparator.greaterThanOrEqual('a', 'a')).toBeTruthy();
  });
});
