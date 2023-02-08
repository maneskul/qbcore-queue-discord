class QueueItem {
  discordId: string;
  priority: number;
  source: string;

  constructor(element: string, priority: number, source: string) {
    this.discordId = element;
    this.priority = priority;
    this.source = source;
  }
}

export class PriorityQueue {
  items: QueueItem[];
  constructor() {
    this.items = [];
  }

  insert(element: any, priority: number, source: string) {
    var qElement = new QueueItem(element, priority, source);
    var contain = false;
    for (var i = 0; i < this.items.length; i++) {
      if (this.items[i].priority > qElement.priority) {
        this.items.splice(i, 0, qElement);
        contain = true;
        break;
      }
    }
    if (!contain) {
      this.items.push(qElement);
    }
  }

  remove() {
    if (this.isEmpty()) return "UnderFlow";
    return this.items.shift();
  }

  front() {
    return this.items[0];
  }

  rear() {
    if (this.isEmpty()) return "No elements in Queue";
    return this.items[this.items.length - 1];
  }

  isEmpty() {
    return this.items.length == 0;
  }

  printQueue() {
    var str = "";
    for (var i = 0; i < this.items.length; i++)
      str += this.items[i].discordId + ", ";
    return str;
  }
}
