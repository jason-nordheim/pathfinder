import { ValueOf } from "ts-essentials";
import { GridGraph } from "../state";

// export const NODE_COLORS = {
//   WHITE: "#FFF",
//   RED: "#FF0000",
//   ORANGE: "#FFA500",
//   GREEN: "#008000",
//   PURPLE: "#DA70D6",
//   TURQUOISE: "#40E0D0",
//   BLACK: "#000",
// } as const;

// type NodeColor = ValueOf<typeof NODE_COLORS>;

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

// export const NODE_COLOR_MAP: { [k in NodeType]: NodeColor } = {
//   [NODE_TYPE.UNPARSED]: NODE_COLORS.WHITE,
//   [NODE_TYPE.OPEN]: NODE_COLORS.GREEN,
//   [NODE_TYPE.CLOSED]: NODE_COLORS.RED,
//   [NODE_TYPE.BARRIER]: NODE_COLORS.BLACK,
//   [NODE_TYPE.START]: NODE_COLORS.ORANGE,
//   [NODE_TYPE.END]: NODE_COLORS.TURQUOISE,
//   [NODE_TYPE.PATH]: NODE_COLORS.PURPLE,
// };

export type NodePosition = { row: number; column: number };
export type NodeModel = NodePosition & {
  key: string;
  type: NodeType;
};
export type KeyedNodePosition = NodePosition & { key: string };

export const initializeNodeModel = (row: number, column: number): NodeModel => ({
  key: makeNodeKey({ row, column }),
  row,
  column,
  type: NODE_TYPE.UNPARSED,
});

export const getNodeNeighbors = (node: NodeModel, grid: GridGraph, gridSize: number) => {
  const neighbors = [];
  const [row, column] = parseNodeKey(node.key);
  const coordinates = {
    above: { row: row + 1, column },
    below: { row: row - 1, column },
    right: { row, column: column + 1 },
    left: { row, column: column - 1 },
  };
  const keys = {
    above: makeNodeKey(coordinates.above),
    below: makeNodeKey(coordinates.below),
    right: makeNodeKey(coordinates.right),
    left: makeNodeKey(coordinates.left),
  };
  const nodes = {
    above: grid[keys.above],
    below: grid[keys.below],
    right: grid[keys.right],
    left: grid[keys.left],
  };
  // down
  if (node.row < gridSize - 1 && nodes.below?.type !== "Barrier") {
    neighbors.push(nodes.below);
  }
  // up
  if (node.row > 0 && nodes.above?.type !== "Barrier") {
    neighbors.push(nodes.above);
  }
  // right
  if (node.column < gridSize - 1 && nodes.right?.type !== "Barrier") {
    neighbors.push(nodes.right);
  }
  // left
  if (node.column > 0 && nodes.left?.type !== "Barrier") {
    neighbors.push(nodes.left);
  }
  return neighbors;
};

export const HeuristicScore = (x1: number, y1: number, x2: number, y2: number) => {
  return Math.abs(x1 - x2) + Math.abs(y1 - y2);
};

export const makeGridGraph = (itemsPerRow: number) => {
  const grid: GridGraph = {};
  for (let i = 0; i < itemsPerRow; i++) {
    for (let j = 0; j < itemsPerRow; j++) {
      const node = initializeNodeModel(i, j);
      grid[node.key] = node;
    }
  }
  return grid;
};

export const makeNodeKey = (node: NodePosition) => `${node.row}_${node.column}`;

export const parseNodeKey = (key: string) => key.split("_").map((str) => Number(str));

export const isSameCoordinates = (a: NodePosition, b: NodePosition) => {
  const matchingRow = a.row == b.row;
  const matchingCol = a.column == b.column;
  return matchingRow && matchingCol;
};

export const getNodePosition = (node: NodePosition) => [node.row, node.column];
