export interface ILRUCache<Key, Value> {
  get size(): number;
  get(key: Key): Value | null;
  put(key: Key, value: Value): this;
  toArray(): Value[];
}
