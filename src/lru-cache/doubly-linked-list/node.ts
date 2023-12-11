export type NullableNode<Key, Value> = Node<Key, Value> | null;

export class Node<K = any, V = any> {
  next: NullableNode<K, V> = null;

  prev: NullableNode<K, V> = null;

  constructor(
    public key: K,
    public value: V,
  ) {
    this.key = key;
    this.value = value;
  }
}
