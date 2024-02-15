export type Callback<T> = (value: T) => string;

export class Node<T = any> {
  data: T;

  constructor(data: T) {
    this.data = data;
  }

  toString(callback?: Callback<T>) {
    return callback ? callback(this.data) : `${this.data}`;
  }
}
