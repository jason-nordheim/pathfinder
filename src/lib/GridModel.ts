export class GridModel {
  rows: number;
  columns: number;
  nodes: { [key: string]: GridItemModel } = {};

  constructor(rows: number, columns: number) {
    this.rows = rows;
    this.columns = columns;
    this.initialize();
  }

  private initialize() {
    // populate the graph
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.columns; col++) {
        const key = this.makeNodeKey(row, col);
        this.nodes[key] = new GridItemModel(row, col);
      }
    }
  }

  makeNodeKey(row: number, column: number) {
    if (!this.isValidRow(row)) throw new Error(`Invalid Row: ${row}`);
    if (!this.isValidColumn(column)) throw new Error(`Invalid Column: ${column}`);
    return `${row}_${column}`;
  }

  getNode(key: string) {
    return this.nodes[key];
  }

  setNode(key: string, value: GridItemModel) {
    this.nodes[key] = value;
  }

  isValidRow(row: number) {
    if (row < this.rows + 1 && row > -1) {
      return true;
    }
    return false;
  }

  isValidColumn(column: number) {
    if (column < this.columns + 1 && column > -1) {
      return true;
    }
    return false;
  }

  getNeighbors(key: string) {
    if (!this.nodes[key]) throw new Error(`Invalid Key: ${key}`);
    const neighbors: string[] = [];
    const right = this.getRight(key),
      left = this.getLeft(key),
      above = this.getAbove(key),
      below = this.getBelow(key);
    if (right) neighbors.push(right);
    if (left) neighbors.push(left);
    if (above) neighbors.push(above);
    if (below) neighbors.push(below);
    return neighbors;
  }

  getLeft(key: string) {
    if (!this.nodes[key]) return undefined;

    const column = this.nodes[key].column - 1;
    if (!this.isValidColumn(column)) return undefined;

    const leftKey = this.makeNodeKey(this.nodes[key].row, column);

    if (this.nodes[leftKey]) {
      return leftKey;
    }

    return undefined;
  }

  getRight(key: string) {
    if (!this.nodes[key]) return undefined;

    const column = this.nodes[key].column + 1;
    if (!this.isValidColumn(column)) return undefined;

    const rightKey = this.makeNodeKey(this.nodes[key].row, column);

    if (this.nodes[rightKey]) {
      return rightKey;
    }

    return undefined;
  }

  getAbove(key: string) {
    if (!this.nodes[key]) return undefined;

    const row = this.nodes[key].row - 1;
    if (!this.isValidRow(row)) return undefined;
    const aboveKey = this.makeNodeKey(row, this.nodes[key].column);

    if (this.nodes[aboveKey]) {
      return aboveKey;
    }

    return undefined;
  }

  getBelow(key: string) {
    if (!this.nodes[key]) return undefined;

    const row = this.nodes[key].row + 1;
    if (!this.isValidRow(row)) return undefined;

    const belowKey = this.makeNodeKey(row, this.nodes[key].column);

    if (this.nodes[belowKey]) {
      return belowKey;
    }

    return undefined;
  }

  dijkstra(start: string, end: string) {
    const queue: string[] = [];
    queue.unshift(start);

    while (queue.length) {
      const current = queue.shift();
      if (!current) break;

      if (current === start) {
        const neighbors = this.getNeighbors(current);

        for (const key of neighbors) {
          // set all the neighbors of the start node
          // to have a weight of 1
          console.log(key);
          this.nodes[key].fromNode = start;
          this.nodes[key].distanceFromRoot = 1;
          // add the neighbors (key) of the start node to the queue
          queue.push(key);
        }
        continue;
      }

      if (current === end) {
        const path: string[] = [];
        let key: string | undefined = current;

        while (key) {
          const previous = this.nodes[key].fromNode;
          previous && path.unshift(previous);
          key = this.nodes[key].fromNode;
        }

        return path;
      }

      const neighbors = this.getNeighbors(current);
      for (const key of neighbors) {
        const tentativeDistance = this.nodes[key].distanceFromRoot! + 1;
        if (!this.nodes[key].distanceFromRoot || tentativeDistance < this.nodes[key].distanceFromRoot!) {
          this.nodes[key].distanceFromRoot = tentativeDistance;
          this.nodes[key].fromNode = current;
          queue.push(key);
          queue.sort((a, b) => this.nodes[a].distanceFromRoot || 0 - (this.nodes[b].distanceFromRoot || 0));
        }
      }
    }
  }
}

class GridItemModel {
  distanceFromRoot?: number;
  fromNode?: string;
  column: number;
  row: number;

  constructor(row: number, column: number) {
    this.row = row;
    this.column = column;
  }
}
