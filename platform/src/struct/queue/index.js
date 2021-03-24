import LinkedList from '../list';

class Queue {

  constructor(iterable = []) {
    this.items = new LinkedList(iterable);
  }

  enqueue(item) {
    this.items.addLast(item);
    return this;
  }

  dequeue() {
    return this.items.removeFirst();
  }

  get size() {
    return this.items.size;
  }

  isEmpty() {
    return !this.items.size;
  }

  back() {
    if (this.isEmpty()) return null;
    return this.items.last.value;
  }

  front() {
    if (this.isEmpty()) return null;
    return this.items.first.value;
  }
}

Queue.prototype.peek = Queue.prototype.front;
Queue.prototype.add = Queue.prototype.enqueue;
Queue.prototype.push = Queue.prototype.enqueue;
Queue.prototype.remove = Queue.prototype.dequeue;
Queue.prototype.pop = Queue.prototype.dequeue;

export default Queue;