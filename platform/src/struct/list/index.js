//const Node = require('./node'); // Doubly

import Node from './node';

class LinkedList {
  
  constructor(
    iterable = [],
    ListNode = Node,
  ) {
    this.first = null; // head/root element
    this.last = null; // last element of the list
    this.size = 0; // total number of elements in the list
    this.ListNode = ListNode;

    Array.from(iterable, (i) => this.addLast(i));
  }

  addFirst(value) {
    const newNode = new this.ListNode(value);

    newNode.next = this.first;

    if (this.first) { // check if first node exists (list not empty)
      this.first.previous = newNode; // <1>
    } else { // if list is empty, first & last will point to newNode.
      this.last = newNode;
    }

    this.first = newNode; // update head
    this.size += 1;

    return newNode;
  }

  addLast(value) {
    const newNode = new Node(value);

    if (this.first) { // check if first node exists (list not empty)
      newNode.previous = this.last;
      this.last.next = newNode;
      this.last = newNode;
    } else { // if list is empty, first & last will point to newNode.
      this.first = newNode;
      this.last = newNode;
    }

    this.size += 1;

    return newNode;
  }

  addAt(value, position = 0) {
    if (position === 0) return this.addFirst(value); // <1>
    if (position === this.size) return this.addLast(value); // <2>

    // Adding element in the middle
    const current = this.findBy({ index: position }).node;
    if (!current) return undefined; // out of bound index

    const newNode = new Node(value); // <3>
    newNode.previous = current.previous; // <4>
    newNode.next = current; // <5>
    current.previous.next = newNode; // <6>
    current.previous = newNode; // <7>
    this.size += 1;
    return newNode;
  }

  getIndexByValue(value) {
    return this.findBy({ value }).index;
  }

  get(index = 0) {
    return this.findBy({ index }).node;
  }

  findBy({ value, index = Infinity } = {}) {
    for (let current = this.first, position = 0; // <1>
      current && position <= index; // <2>
      position += 1, current = current.next) { // <3>
      if (position === index || value === current.value) { // <4>
        return { node: current, index: position }; // <5>
      }
    }
    return {};
  }

  removeFirst() {
    if (!this.first) {
      return null;
    }
    const head = this.first;
    this.first = head.next;
    if (this.first) {
      this.first.previous = null;
    } else {
      this.last = null;
    }
    this.size -= 1;
    return head.value;
  }

  removeLast() {
    if (!this.last) {
      return null;
    }
    const tail = this.last;

    this.last = tail.previous;
    if (this.last) {
      this.last.next = null;
    } else {
      this.first = null;
    }
    this.size -= 1;
    return tail.value;
  }

  removeByPosition(position = 0) {
    if (position === 0) return this.removeFirst();
    if (position === this.size - 1) return this.removeLast();
    const current = this.findBy({ index: position }).node;
    if (!current) return null;
    current.previous.next = current.next;
    current.next.previous = current.previous;
    this.size -= 1;
    return current && current.value;
  }

  removeByNode(node) {
    if (!node) { return null; }
    if (node === this.first) {
      return this.removeFirst();
    }
    if (node === this.last) {
      return this.removeLast();
    }
    node.previous.next = node.next;
    node.next.previous = node.previous;
    this.size -= 1;

    return node.value;
  }

  * [Symbol.iterator]() {
    for (let node = this.first; node; node = node.next) {
      yield node;
    }
  }

  get length() {
    return this.size;
  }

  find(callback) {
    for (let current = this.first, position = 0;
      current;
      position += 1, current = current.next) {
      const result = callback(current, position);

      if (result !== undefined) {
        return result;
      }
    }
    return undefined;
  }

  remove(callbackOrIndex) {
    if (typeof callbackOrIndex !== 'function') {
      return this.removeByPosition(parseInt(callbackOrIndex, 10) || 0);
    }

    const position = this.find((node, index) => {
      if (callbackOrIndex(node, index)) {
        return index;
      }
      return undefined;
    });

    if (position !== undefined) {
      return this.removeByPosition(position);
    }

    return false;
  }
}

LinkedList.prototype.push = LinkedList.prototype.addLast;
LinkedList.prototype.pop = LinkedList.prototype.removeLast;
LinkedList.prototype.unshift = LinkedList.prototype.addFirst;
LinkedList.prototype.shift = LinkedList.prototype.removeFirst;
LinkedList.prototype.search = LinkedList.prototype.contains;

export default LinkedList;