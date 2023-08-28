export class PriorityQueue<T> {
  elements: [T, number][] = [];

  enqueue(element: T, priority: number) {
    this.elements.push([element, priority]);
    this.elements.sort((a, b) => a[1] - b[1]);
  }

  dequeue(): T | undefined {
    return this.elements.shift()?.[0];
  }

  isEmpty(): boolean {
    return this.elements.length === 0;
  }
}
