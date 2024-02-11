import isEqual from 'lodash.isequal';

export type CompareFunction<T> = (a: T, b: T) => -1 | 0 | 1;

export class Comparator<T = unknown> {
  #compare: CompareFunction<T>;

  #isEqual = isEqual;

  static defaultCompareFunction<T = unknown>(a: T, b: T) {
    if (a === b) return 0;

    return a < b ? -1 : 1;
  }

  constructor(compareFunction?: CompareFunction<T>) {
    this.#compare = compareFunction ?? Comparator.defaultCompareFunction;
  }

  equal(a: unknown, b: unknown) {
    return this.#isEqual(a, b);
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
