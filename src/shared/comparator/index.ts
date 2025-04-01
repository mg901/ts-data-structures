import isEqual from 'lodash.isequal';

export type CompareFn<T> = (a: T, b: T) => number;

export class Comparator<T = any> {
  #compare: CompareFn<T>;

  #isEqual: (a: T, b: T) => boolean = isEqual;

  static defaultCompareFunction<T = keyof any>(a: T, b: T) {
    return a < b ? -1 : 1;
  }

  constructor(compareFn?: CompareFn<T>) {
    this.#compare = compareFn ?? Comparator.defaultCompareFunction;
  }

  equal(a: T, b: T): boolean {
    return this.#isEqual(a, b);
  }

  lessThan(a: T, b: T): boolean {
    return this.#compare(a, b) < 0;
  }

  greaterThan(a: T, b: T): boolean {
    return this.#compare(a, b) > 0;
  }

  lessThanOrEqual(a: T, b: T): boolean {
    return this.lessThan(a, b) || this.equal(a, b);
  }

  greaterThanOrEqual(a: T, b: T): boolean {
    return this.greaterThan(a, b) || this.equal(a, b);
  }

  reverse(): void {
    const compareOriginal = this.#compare;
    this.#compare = (a, b) => compareOriginal(b, a);
  }
}
