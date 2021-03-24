//const LinkedList = require('../linked-lists/linked-list');
import LinkedList from '../list';

class Stack {

  constructor() {
    this.items = new LinkedList();
  }

  add(item) {
    this.items.addLast(item);
    return this;
  }

  remove() {
    return this.items.removeLast();
  }

  get size() {
    return this.items.size;
  }


  isEmpty() {
    return !this.items.size;
  }
}

Stack.prototype.push = Stack.prototype.add;
Stack.prototype.pop = Stack.prototype.remove;

export default Stack;
