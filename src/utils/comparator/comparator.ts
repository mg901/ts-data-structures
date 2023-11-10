export type CompareFunction<T> = (a: T, b: T) => -1 | 0 | 1;

export class Comparator<T = any> {
  compare: (a: any, b: any) => -1 | 0 | 1;

  static defaultCompareFunction<T>(a: T, b: T) {
    if (a === b) return 0;

    return a < b ? -1 : 1;
  }

  constructor(compareFunction?: CompareFunction<T>) {
    this.compare = compareFunction || Comparator.defaultCompareFunction;
  }

  equal(a: T, b: T): boolean {
    return this.compare(a, b) === 0;
  }

  lessThan(a: T, b: T) {
    return this.compare(a, b) < 0;
  }

  greaterThan(a: T, b: T) {
    return this.compare(a, b) > 0;
  }

  lessThanOrEqual(a: T, b: T) {
    return this.lessThan(a, b) || this.equal(a, b);
  }

  greaterThanOrEqual(a: T, b: T) {
    return this.greaterThan(a, b) || this.equal(a, b);
  }

  reverse(): void {
    const originalCompare = this.compare;
    this.compare = (a: T, b: T) => originalCompare(a, b);
  }
}
