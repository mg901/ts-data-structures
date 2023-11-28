import isEqual from 'lodash.isequal';

export type CompareFunction<T> = (a: T, b: T) => -1 | 0 | 1;

export interface IComparator<T> {
  equal(a: T, b: T): boolean;
  lessThan(a: T, b: T): boolean;
  greaterThan(a: T, b: T): boolean;
  lessThanOrEqual(a: T, b: T): boolean;
  greaterThanOrEqual(a: T, b: T): boolean;
  reverse(): void;
}

export class Comparator<T = any> implements IComparator<T> {
  #compare: CompareFunction<T>;

  #isEqualFn: typeof isEqual;

  static defaultCompareFunction<T>(a: T, b: T) {
    if (a === b) return 0;

    return a < b ? -1 : 1;
  }

  constructor(
    compareFunction?: CompareFunction<T>,
    isEqualFn: typeof isEqual = isEqual,
  ) {
    this.#compare = compareFunction || Comparator.defaultCompareFunction;
    this.#isEqualFn = isEqualFn;
  }

  equal(a: T, b: T) {
    return this.#isEqualFn(a, b);
  }

  lessThan(a: T, b: T) {
    return this.#compare(a, b) < 0;
  }

  greaterThan(a: T, b: T) {
    return this.#compare(a, b) > 0;
  }

  lessThanOrEqual(a: T, b: T) {
    return this.lessThan(a, b) || this.equal(a, b);
  }

  greaterThanOrEqual(a: T, b: T) {
    return this.greaterThan(a, b) || this.equal(a, b);
  }

  reverse() {
    const compareOriginal = this.#compare;

    this.#compare = (a, b) => compareOriginal(b, a);
  }
}
