/**
 * A Min-Priority Queue implementation using a Binary Heap.
 * Elements with lower priority values are dequeued first.
 */
export class PriorityQueue {
  constructor() {
    this.values = [];
  }

  /**
   * Enqueues an element with a given priority.
   * @param {any} val - The element to store
   * @param {number} priority - The priority weight (lower means higher priority)
   */
  enqueue(val, priority) {
    this.values.push({ val, priority });
    this.bubbleUp();
  }

  /**
   * Dequeues and returns the element with the highest priority (lowest weight).
   * @returns {Object} { val, priority }
   */
  dequeue() {
    if (this.values.length === 0) return null;
    const min = this.values[0];
    const end = this.values.pop();
    if (this.values.length > 0) {
      this.values[0] = end;
      this.sinkDown();
    }
    return min;
  }

  /**
   * Checks if the queue is empty.
   * @returns {boolean}
   */
  isEmpty() {
    return this.values.length === 0;
  }

  /**
   * Returns the current size of the queue.
   * @returns {number}
   */
  size() {
    return this.values.length;
  }

  /**
   * Bubbles the last element up to its correct heap position.
   * @private
   */
  bubbleUp() {
    let idx = this.values.length - 1;
    const element = this.values[idx];
    while (idx > 0) {
      const parentIdx = Math.floor((idx - 1) / 2);
      const parent = this.values[parentIdx];
      if (element.priority >= parent.priority) break;
      this.values[parentIdx] = element;
      this.values[idx] = parent;
      idx = parentIdx;
    }
  }

  /**
   * Sinks the root element down to its correct heap position.
   * @private
   */
  sinkDown() {
    let idx = 0;
    const length = this.values.length;
    const element = this.values[0];
    
    while (true) {
      const leftChildIdx = 2 * idx + 1;
      const rightChildIdx = 2 * idx + 2;
      let leftChild, rightChild;
      let swap = null;

      if (leftChildIdx < length) {
        leftChild = this.values[leftChildIdx];
        if (leftChild.priority < element.priority) {
          swap = leftChildIdx;
        }
      }

      if (rightChildIdx < length) {
        rightChild = this.values[rightChildIdx];
        if (
          (swap === null && rightChild.priority < element.priority) ||
          (swap !== null && rightChild.priority < leftChild.priority)
        ) {
          swap = rightChildIdx;
        }
      }

      if (swap === null) break;
      this.values[idx] = this.values[swap];
      this.values[swap] = element;
      idx = swap;
    }
  }
}
