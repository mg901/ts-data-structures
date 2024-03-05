export type Payload<Key, Value> = {
  key: Key;
  value: Value;
};

export interface ICache<Key extends keyof any, Value> {
  get size(): number;
  get isEmpty(): boolean;

  toArray<T>(callbackfn?: (item: Payload<Key, Value>) => T): T[];
  put(key: Key, value: Value): this;
  get(key: Key): Value | null;
  clear(): void;
}
