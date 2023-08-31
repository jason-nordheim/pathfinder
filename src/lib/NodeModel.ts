import { ValueOf } from "ts-essentials";

export const NODE_COLORS = {
  WHITE: "#FFF",
  RED: "#FF0000",
  ORANGE: "#FFA500",
  GREEN: "#008000",
  PURPLE: "#DA70D6",
  TURQUOISE: "#40E0D0",
  BLACK: "#000",
} as const;

type NodeColor = ValueOf<typeof NODE_COLORS>;

export const NODE_TYPE = {
  UNPARSED: "Unparsed",
  OPEN: "Open",
  CLOSED: "Closed",
  BARRIER: "Barrier",
  START: "Start",
  END: "End",
  PATH: "Path",
} as const;

export type NodeType = ValueOf<typeof NODE_TYPE>;

export const NODE_COLOR_MAP: { [k in NodeType]: NodeColor } = {
  [NODE_TYPE.UNPARSED]: NODE_COLORS.WHITE,
  [NODE_TYPE.OPEN]: NODE_COLORS.GREEN,
  [NODE_TYPE.CLOSED]: NODE_COLORS.RED,
  [NODE_TYPE.BARRIER]: NODE_COLORS.BLACK,
  [NODE_TYPE.START]: NODE_COLORS.ORANGE,
  [NODE_TYPE.END]: NODE_COLORS.TURQUOISE,
  [NODE_TYPE.PATH]: NODE_COLORS.PURPLE,
};

export type NodeModel = {
  row: number;
  column: number;
  size: number;
  x: number;
  y: number;
  type: NodeType;
};

export const initializeNodeModel = (row: number, column: number, size: number): NodeModel => ({
  row,
  column,
  size,
  x: row * size,
  y: column * size,
  type: NODE_TYPE.UNPARSED,
});

export const getNodeNeighbors = (node: NodeModel, grid: NodeModel[][]) => {
  const neighbors = [];
  const gridSize = grid.length;
  if (node.row < gridSize - 1 && grid[node.row + 1][node.column].type !== "Barrier") {
    neighbors.push(grid[node.row + 1][node.column]);
  }
  // up
  if (node.row > 0 && grid[node.row - 1][node.column].type !== "Barrier") {
    neighbors.push(grid[node.row - 1][node.column]);
  }
  // right
  if (node.column < gridSize - 1 && grid[node.row][node.column + 1].type !== "Barrier") {
    neighbors.push(grid[node.row][node.column + 1]);
  }
  // left
  if (node.column > 0 && grid[node.row][node.column - 1].type !== "Barrier") {
    neighbors.push(grid[node.row][node.column - 1]);
  }
  return neighbors;
};

export const HeuristicScore = (x1: number, y1: number, x2: number, y2: number) => {
  return Math.abs(x1 - x2) + Math.abs(y1 - y2);
};

export const makeGrid = (itemsPerRow: number, gridSize: number) => {
  const grid: NodeModel[][] = [];
  console.log({ gridSize, itemsPerRow });
  const gap = Math.floor(gridSize / itemsPerRow);
  for (let i = 0; i < itemsPerRow; i++) {
    grid.push([]);
    for (let j = 0; j < itemsPerRow; j++) {
      const node = initializeNodeModel(i, j, gap);
      grid[i].push(node);
    }
  }
  return grid;
};

export const makeNodeKey = (node: NodeModel) => `${node.row}_${node.column}`;

export const parseNodeKey = (key: string) => key.split("_").map((str) => Number(str));

export const isSameCoordinates = (a: NodeModel, b: NodeModel) => {
  const matchingRow = a.row == b.row;
  const matchingCol = a.column == b.column;
  return matchingRow && matchingCol;
};

export const getNodePosition = (node: NodeModel) => [node.row, node.column];
