export type Payload<Key, Value> = {
  key: Key;
  value: Value;
};

export interface ICache<Key extends keyof any, Value> {
  get size(): number;

  put(key: Key, value: Value): this;
  get(key: Key): Value | null;
  clear(): void;
}
