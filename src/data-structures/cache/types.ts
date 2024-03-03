export interface ICache<Key extends keyof any, Value> {
  get size(): number;
  get isEmpty(): boolean;

  toArray(): Value[];
  put(key: Key, value: Value): this;
  get(key: Key): Value | null;
  clear(): void;
}
