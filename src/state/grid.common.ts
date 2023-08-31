import { DeepPartial } from "ts-essentials";
import { NodeModel } from "../lib/NodeModel";

export type GridStatus = "working" | "idle" | "finished";
export type OpenNode = { model: NodeModel; count: number; priority: number };
export type GridState = {
  grid: {
    nodes: NodeModel[][];
    start?: NodeModel;
    end?: NodeModel;
    barriers: NodeModel[];
    status: GridStatus;
    delay: number;
  };
};
export type InitializeGridParams = { size: number; width: number };
export type ChangeNodeParams = { row: number; column: number; changes: DeepPartial<NodeModel> };

export const sortPriority = (a: OpenNode, b: OpenNode) =>
  a.priority === b.priority ? a.count - b.count : a.priority - b.priority;
