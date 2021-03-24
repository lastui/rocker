//const HashMap = require('../maps/hash-maps/hash-map');
import HashMap from '../map';

class HashMapSet {

  constructor(iterable = []) {
    this.hashMap = new HashMap();
    Array.from(iterable).forEach((element) => this.add(element));
  }

  get size() {
    return this.hashMap.size;
  }

  add(value) {
    this.hashMap.set(value);
  }

  has(value) {
    return this.hashMap.has(value);
  }

  delete(value) {
    return this.hashMap.delete(value);
  }

  * [Symbol.iterator]() {
    yield* this.hashMap.keys();
  }

  * keys() {
    yield* this;
  }

  * entries() {
    for (const value of this) {
      yield [value, value];
    }
  }

}

export default HashMapSet;