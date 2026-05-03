type CacheItem<V> = {
  value: V;
  freq: number;
};

export class MFUCache<K, V> {
  #capacity: number;
  #map: Map<K, CacheItem<V>>;
  #freqKeysMap: Map<number, Set<K>>;
  #maxFreq: number;

  constructor(capacity: number) {
    this.#capacity = capacity;
    this.#map = new Map();
    this.#freqKeysMap = new Map();
    this.#maxFreq = 0;
  }

  get(key: K): V | -1 {
    if (!this.#map.has(key)) return -1;

    const { value, freq } = this.#map.get(key)!;

    this.#removeFromFreqMap(key, freq);
    this.#addToFreqMap(key, freq + 1);
    this.#map.set(key, { value, freq: freq + 1 });

    return value;
  }

  put(key: K, value: V): void {
    if (this.#capacity === 0) return;

    if (this.#map.has(key)) {
      const { freq } = this.#map.get(key)!;
      this.#map.set(key, { value, freq });
      this.get(key);

      return;
    }

    if (this.#map.size >= this.#capacity) {
      const keysWithMaxFreq = this.#freqKeysMap.get(this.#maxFreq)!;
      const victim = keysWithMaxFreq.values().next().value as K;

      keysWithMaxFreq.delete(victim);
      this.#map.delete(victim);
    }

    this.#map.set(key, { value, freq: 1 });
    this.#addToFreqMap(key, 1);
    this.#maxFreq = Math.max(this.#maxFreq, 1);
  }

  #addToFreqMap(key: K, freq: number): void {
    if (!this.#freqKeysMap.has(freq)) {
      this.#freqKeysMap.set(freq, new Set());
    }

    this.#freqKeysMap.get(freq)!.add(key);
    this.#maxFreq = Math.max(this.#maxFreq, freq);
  }

  #removeFromFreqMap(key: K, freq: number): void {
    const keys = this.#freqKeysMap.get(freq);
    if (!keys) return;

    keys.delete(key);
    if (keys.size === 0) {
      this.#freqKeysMap.delete(freq);

      if (freq === this.#maxFreq) {
        this.#maxFreq = Math.max(...this.#freqKeysMap.keys(), 0);
      }
    }
  }
}
