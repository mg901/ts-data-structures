export type CompareFunction<T> = (a: T, b: T) => -1 | 0 | 1;

export interface ComparatorType<T> {
  equal(a: T, b: T): boolean;
  lessThan(a: T, b: T): boolean;
  greaterThan(a: T, b: T): boolean;
  lessThanOrEqual(a: T, b: T): boolean;
  greaterThanOrEqual(a: T, b: T): boolean;
  reverse(): void;
}

export class Comparator<T = any> implements ComparatorType<T> {
  #compare: CompareFunction<T>;

  static defaultCompareFunction<T>(a: T, b: T) {
    if (a === b) return 0;

    return a < b ? -1 : 1;
  }

  constructor(compareFunction?: CompareFunction<T>) {
    this.#compare = compareFunction || Comparator.defaultCompareFunction;
  }

  equal(a: T, b: T) {
    return this.#compare(a, b) === 0;
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
