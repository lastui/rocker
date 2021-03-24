const HashSet = require('../sets/hash-set');

class Node {
  constructor(value) {
    this.value = value;
    this.adjacents = new HashSet();
  }

  addAdjacent(node) {
    this.adjacents.add(node);
  }

  removeAdjacent(node) {
    return this.adjacents.delete(node);
  }

  isAdjacent(node) {
    return this.adjacents.has(node);
  }

  getAdjacents() {
    return Array.from(this.adjacents);
  }

}


export default Node;
