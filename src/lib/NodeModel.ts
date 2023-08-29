import { ValueOf } from "ts-essentials";

const NODE_COLORS = {
  WHITE: "#FFF",
  RED: "#FF0000",
  ORANGE: "#FFA500",
  GREEN: "#008000",
  PURPLE: "#DA70D6",
  TURQUOISE: "#40E0D0",
  BLACK: "#000",
} as const;

type NodeColor = ValueOf<typeof NODE_COLORS>;

const NODE_TYPE = {
  UNPARSED: "Unparsed",
  OPEN: "Open",
  CLOSED: "Closed",
  BARRIER: "Barrier",
  START: "Start",
  END: "End",
  PATH: "Path",
} as const;

export type NodeType = ValueOf<typeof NODE_TYPE>;

const NODE_COLOR_MAP: { [k in NodeType]: NodeColor } = {
  [NODE_TYPE.UNPARSED]: NODE_COLORS.WHITE,
  [NODE_TYPE.OPEN]: NODE_COLORS.GREEN,
  [NODE_TYPE.CLOSED]: NODE_COLORS.RED,
  [NODE_TYPE.BARRIER]: NODE_COLORS.BLACK,
  [NODE_TYPE.START]: NODE_COLORS.ORANGE,
  [NODE_TYPE.END]: NODE_COLORS.TURQUOISE,
  [NODE_TYPE.PATH]: NODE_COLORS.PURPLE,
};

// Spot
export class NodeModel {
  row: number;
  column: number;
  width: number;

  totalRows: number;
  totalColumns: number;

  x: number;
  y: number;

  type: NodeType;

  neighbors: NodeModel[] = [];

  constructor(row: number, column: number, width: number, gridSize: number) {
    this.row = row;
    this.column = column;
    this.width = width;
    this.totalRows = gridSize;
    this.totalColumns = gridSize;
    this.x = row * width;
    this.y = column * width;
    this.type = NODE_TYPE.UNPARSED;
  }

  setType(type: NodeType) {
    this.type = type;
  }

  getPosition() {
    return [this.row, this.column];
  }

  getColor() {
    return NODE_COLOR_MAP[this.type];
  }

  reset() {
    this.type = NODE_TYPE.UNPARSED;
  }

  updateNeighbors(grid: NodeModel[][]) {
    this.neighbors = [];
    // down
    if (this.row < this.totalRows - 1 && grid[this.row + 1][this.column].type !== "Barrier") {
      this.neighbors.push(grid[this.row + 1][this.column]);
    }
    // up
    if (this.row > 0 && grid[this.row - 1][this.column].type !== "Barrier") {
      this.neighbors.push(grid[this.row - 1][this.column]);
    }
    // right
    if (this.column < this.totalRows - 1 && grid[this.row][this.column + 1].type !== "Barrier") {
      this.neighbors.push(grid[this.row][this.column + 1]);
    }
    // left
    if (this.column > 0 && grid[this.row][this.column - 1].type !== "Barrier") {
      this.neighbors.push(grid[this.row][this.column - 1]);
    }
  }
}

export const HeuristicScore = (x1: number, y1: number, x2: number, y2: number) => {
  return Math.abs(x1 - x2) + Math.abs(y1 - y2);
};

export const makeGrid = (size: number, width: number) => {
  const grid: NodeModel[][] = [];
  const gap = Math.floor(width / size);
  for (let i = 0; i < size; i++) {
    grid.push([]);
    for (let j = 0; j < size; j++) {
      const node = new NodeModel(i, j, gap, size);
      grid[i].push(node);
    }
  }
  return grid;
};

export const makeNodeKey = (node: NodeModel) => `${node.row}_${node.column}`;

export const algorithm = (grid: NodeModel[][], start: NodeModel, end: NodeModel, abort: AbortSignal) => {
  return new Promise((resolve, reject) => {
    let count = 0;
    const openSet: OpenSetItem[] = [];
    const openSetHash = new Set<NodeModel>();
    const cameFrom = new Map<string, string>();

    // setup Infinity as default values for all nodes
    const gScores = new Map<string, number>();
    const fScores = new Map<string, number>();
    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid[i].length; j++) {
        const key = makeNodeKey(grid[i][j]);
        gScores.set(key, Infinity);
        fScores.set(key, Infinity);
      }
    }

    // standardize adding to the queue
    const addNode = (node: NodeModel, count: number, priority: number) => {
      openSetHash.add(node);
      openSet.push({ model: node, count, priority });
      openSet.sort((a, b) => {
        if (a.priority === b.priority) {
          return a.count - b.count;
        }
        return a.priority - b.priority;
      });
    };

    // setup the open set
    addNode(start, count, 0);

    // set the g score for the start node
    const startKey = makeNodeKey(start);
    gScores.set(startKey, 0);

    // estimate the distance from the start node to the end node
    const [x1, y1] = start.getPosition();
    const [x2, y2] = end.getPosition();
    fScores.set(startKey, HeuristicScore(x1, y1, x2, y2));

    while (openSet.length) {
      if (abort.aborted) {
        reject();
      }

      const current = openSet.shift()?.model;
      if (current) {
        openSetHash.delete(current);

        if (current == end) {
          // todo: make path

          resolve(true);
        }

        for (const n of current.neighbors) {
          const neighborKey = makeNodeKey(n);
          const currentKey = makeNodeKey(current);
          const tentativeScore = gScores.get(currentKey)! + 1;
          if (tentativeScore < gScores.get(neighborKey)!) {
            cameFrom.set(neighborKey, currentKey);
            gScores.set(neighborKey, tentativeScore);
            const [x1, y1] = n.getPosition();
            const [x2, y2] = end.getPosition();
            fScores.set(neighborKey, tentativeScore + HeuristicScore(x1, y1, x2, y2));
            if (openSetHash.has(n)) {
              count++;
              addNode(n, count, fScores.get(neighborKey)!);
              n.setType("Open");
            }
          }
        }

        if (current !== start) {
          current.setType("Closed");
        }
      }
    }

    console.log({ grid });
    resolve(undefined);
  });
};
