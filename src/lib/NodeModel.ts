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

const NODE_STATE = {
  OPEN: "Open",
  CLOSED: "Closed",
  BARRIER: "Barrier",
  START: "Start",
  END: "End",
  PATH: "Path",
} as const;

type NodeState = ValueOf<typeof NODE_STATE>;

const NODE_COLOR_MAP: { [k in NodeState]: NodeColor } = {
  [NODE_STATE.OPEN]: NODE_COLORS.GREEN,
  [NODE_STATE.CLOSED]: NODE_COLORS.RED,
  [NODE_STATE.BARRIER]: NODE_COLORS.BLACK,
  [NODE_STATE.START]: NODE_COLORS.ORANGE,
  [NODE_STATE.END]: NODE_COLORS.TURQUOISE,
  [NODE_STATE.PATH]: NODE_COLORS.PURPLE,
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

  state: NodeState;

  neighbors = [];

  constructor(row: number, column: number, width: number, totalRows: number, totalColumns: number) {
    this.row = row;
    this.column = column;
    this.width = width;
    this.totalRows = totalRows;
    this.totalColumns = totalColumns;
    this.x = row * width;
    this.y = column * width;
    this.state = NODE_STATE.OPEN;
  }

  setStatus(status: NodeState) {
    this.state = status;
  }

  getPosition() {
    return [this.row, this.column];
  }

  getColor() {
    return NODE_COLOR_MAP[this.state];
  }

  reset() {
    this.state = NODE_STATE.OPEN;
  }
}
