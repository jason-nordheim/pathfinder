import { DeepPartial } from "ts-essentials";
import { KeyedNodePosition, NodeModel } from "../lib/NodeModel";

export type GridGraph = { [key: string]: NodeModel };
export type GridStatus = "working" | "idle" | "finished";
export type OpenNode = { model: NodeModel; count: number; priority: number };
export type GridState = {
  nodes: GridGraph;
  start?: KeyedNodePosition;
  end?: KeyedNodePosition;
  barriers: KeyedNodePosition[];
  status: GridStatus;
  delay: number;
  itemsPerRow: number;
  updates: number;
};
export type InitializeGridParams = { numPerRow: number };
export type ChangeNodeParams = { key: string; changes: DeepPartial<NodeModel> };

export const sortPriority = (a: OpenNode, b: OpenNode) =>
  a.priority === b.priority ? a.count - b.count : a.priority - b.priority;
