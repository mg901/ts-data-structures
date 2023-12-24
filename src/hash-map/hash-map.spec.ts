import { describe, beforeEach, it, expect } from 'vitest';
import { HashMap } from './hash-map';

describe('HashMap', () => {
  let hashMap: HashMap<string, number>;

  // Arrange;
  beforeEach(() => {
    hashMap = new HashMap<string, number>();
  });

  it('set and get values', () => {
    // Act
    hashMap.set('one', 1);
    hashMap.set('two', 2);

    // Assert
    expect(hashMap.get('one')).toBe(1);
    expect(hashMap.get('two')).toBe(2);
  });

  it('updates existing values', () => {
    // Act
    hashMap.set('value', 1);
    hashMap.set('value', 2);

    // Assert
    expect(hashMap.get('value')).toBe(2);
  });

  it('checks if a key exists using has method ', () => {
    // Arrange
    hashMap.set('one', 1);
    hashMap.set('two', 2);

    // Act and Assert
    expect(hashMap.has('one')).toBeTruthy();
    expect(hashMap.has('two')).toBeTruthy();
    expect(hashMap.has('three')).toBeFalsy();
  });
});
