export interface ICache<Key, Value> {
  get size(): number;
  toArray(): Value[];
  isEmpty(): boolean;
  put(key: Key, value: Value): this;
  get(key: Key): Value | null;
  clear(): void;
}

export type Payload<Key, Value> = {
  key: Key;
  value: Value;
};
