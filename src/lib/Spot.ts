import { ValueOf } from "ts-essentials";

const NODE_COLORS = {
  WHITE: "#FFF",
  RED: "#FF0000",
  ORANGE: "#FFA500",
  GREEN: "#008000",
  PURPLE: "#DA70D6",
  BLACK: "#000",
} as const;

type NodeColor = ValueOf<typeof NODE_COLORS>;

// const NODE_STATE = {
//   OPEN: "Open",
//   CLOSED: "Closed",
//   BARRIER: "Barrier",
//   START: "Start",
//   END: "End",
// } as const;

// type NodeState = ValueOf<typeof NODE_STATE>;

// Spot
export class NodeModel {
  row: number;
  column: number;
  width: number;

  totalRows: number;
  totalColumns: number;

  x: number;
  y: number;

  color: NodeColor;

  neighbors = [];

  constructor(row: number, column: number, width: number, totalRows: number, totalColumns: number) {
    this.row = row;
    this.column = column;
    this.width = width;
    this.totalRows = totalRows;
    this.totalColumns = totalColumns;
    this.x = row * width;
    this.y = column * width;
    this.color = NODE_COLORS.WHITE;
  }

  getPosition() {
    return [this.row, this.column];
  }

  isClosed() {
    return this.color === NODE_COLORS.RED;
  }
  setClosed() {
    this.color = NODE_COLORS.RED;
  }

  isOpen() {
    return this.color === NODE_COLORS.GREEN;
  }
  setOpen() {
    this.color = NODE_COLORS.GREEN;
  }

  isBarrier() {
    return this.color === NODE_COLORS.BLACK;
  }

  isStart() {
    return this.color === NODE_COLORS.ORANGE;
  }

  isEnd() {
    return this.color === NODE_COLORS.PURPLE;
  }

  reset() {
    this.color = NODE_COLORS.WHITE;
  }
}
