
import LinkedList from '../list';

const encoding = new TextEncoder();

function isPrime(number) {
  if (number < 2) { return false; }
  const max = Math.sqrt(number);
  for (let divisor = 2; divisor <= max; divisor++) {
    if (number % divisor === 0) {
      return false;
    }
  }
  return true;
}

function nextPrime(number) {
  if (number < 2) { return 2; }
  let possiblePrime = number % 2 !== 0 ? number + 2 : number + 1;

  while (!isPrime(possiblePrime)) {
    possiblePrime += 2;
  }
  return possiblePrime;
}

class HashMap {

  constructor(initialCapacity = 19, loadFactor = 0.75) {
    this.initialCapacity = initialCapacity;
    this.loadFactor = loadFactor;
    this.reset();
  }

  reset(
    buckets = new Array(this.initialCapacity),
    size = 0,
    collisions = 0,
    keysTrackerArray = [],
    keysTrackerIndex = 0,
  ) {
    this.buckets = buckets;
    this.size = size;
    this.collisions = collisions;
    this.keysTrackerArray = keysTrackerArray;
    this.keysTrackerIndex = keysTrackerIndex;
  }

  hashFunction(key) {
    const bytes = encoding.encode(key);
    const { length } = bytes;

    let hash = 2166136261; // FNV_offset_basis (32 bit)

    for (let i = 0; i < length; i++) {
      hash ^= bytes[i]; // XOR
      hash *= 16777619; // 32 bit FNV_prime
    }

    return (hash >>> 0) % this.buckets.length;
  }

  getEntry(key) {
    const index = this.hashFunction(key); // <1>
    this.buckets[index] = this.buckets[index] || new LinkedList(); // <2>
    const bucket = this.buckets[index];

    const entry = bucket.find(({ value: node }) => { // <3>
      if (key === node.key) {
        return node; // stop search
      }
      return undefined; // continue searching
    });

    return { bucket, entry }; // <4>
  }

  set(key, value) {
    const { entry: exists, bucket } = this.getEntry(key);

    if (!exists) {
      bucket.push({ key, value, order: this.keysTrackerIndex });
      this.keysTrackerArray[this.keysTrackerIndex] = key;
      this.keysTrackerIndex += 1;
      this.size += 1;
      if (bucket.size > 1) { this.collisions += 1; }
      if (this.isBeyondloadFactor()) { this.rehash(); }
    } else {
      exists.value = value;
    }
    return this;
  }

  get(key) {
    const { entry } = this.getEntry(key);
    return entry && entry.value;
  }

  has(key) {
    const { entry } = this.getEntry(key);
    return entry !== undefined;
  }

  delete(key) {
    const { bucket, entry } = this.getEntry(key);
    if (!entry) { return false; }

    return !!bucket.remove((node) => {
      if (key === node.value.key) {
        delete this.keysTrackerArray[node.value.order];
        this.size -= 1;
        return true;
      }
      return undefined;
    });
  }

  getLoadFactor() {
    return this.size / this.buckets.length;
  }

  isBeyondloadFactor() {
    return this.getLoadFactor() > this.loadFactor;
  }

  rehash(newBucketSize = Math.max(this.size, this.buckets.length) * 2) {
    const newCapacity = nextPrime(newBucketSize);
    const newMap = new HashMap(newCapacity);

    for (const key of this.keys()) {
      newMap.set(key, this.get(key));
    }

    const newArrayKeys = Array.from(newMap.keys());

    this.reset(
      newMap.buckets,
      newMap.size,
      newMap.collisions,
      newArrayKeys,
      newArrayKeys.length,
    );
  }

  * keys() {
    for (let index = 0; index < this.keysTrackerArray.length; index++) {
      const key = this.keysTrackerArray[index];
      if (key !== undefined) {
        yield key;
      }
    }
  }

  * values() {
    for (const key of this.keys()) {
      yield this.get(key);
    }
  }

  * entries() {
    for (const key of this.keys()) {
      yield [key, this.get(key)];
    }
  }

  * [Symbol.iterator]() {
    yield* this.entries();
  }

  get length() {
    return this.size;
  }

  clear() {
    this.reset();
  }
}

HashMap.prototype.containsKey = HashMap.prototype.has;

export default HashMap;
