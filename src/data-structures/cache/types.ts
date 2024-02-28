export interface ICache<Key, Value> {
  get size(): number;
  get isEmpty(): boolean;
  toArray(): Value[];
  put(key: Key, value: Value): this;
  get(key: Key): Value | null;
  clear(): void;
}

export type Payload<Key, Value> = {
  key: Key;
  value: Value;
};
