import isEqual from 'lodash.isequal';

export type CompareFn<T> = (a: T, b: T) => -1 | 0 | 1;

export class Comparator<T = any> {
  #compare: CompareFn<T>;

  #isEqual = isEqual;

  static defaultCompareFunction<T = any>(a: T, b: T) {
    if (a === b) return 0;

    return a < b ? -1 : 1;
  }

  constructor(compareFunction?: CompareFn<T>) {
    this.#compare = compareFunction ?? Comparator.defaultCompareFunction;
  }

  equal(a: T, b: any) {
    return this.#isEqual(a, b);
  }

  lessThan(a: T, b: any) {
    return this.#compare(a, b) < 0;
  }

  greaterThan(a: T, b: any) {
    return this.#compare(a, b) > 0;
  }

  lessThanOrEqual(a: T, b: any) {
    return this.lessThan(a, b) || this.equal(a, b);
  }

  greaterThanOrEqual(a: T, b: any) {
    return this.greaterThan(a, b) || this.equal(a, b);
  }

  reverse() {
    const compareOriginal = this.#compare;

    this.#compare = (a, b) => compareOriginal(b, a);
  }
}
