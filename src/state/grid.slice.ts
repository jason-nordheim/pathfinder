import { SliceCaseReducers, createReducer, createSlice } from "@reduxjs/toolkit";
import { GridState } from "./grid.common";
import { changeNode, initializeGraph, replaceNodes, resetNode, setStatus } from "./grid.actions";
import { mergeRight } from "rambda";
import { initializeNodeModel, makeGridGraph, parseNodeKey } from "../lib/NodeModel";

export const DEFAULT_NODES_PER_ROW = 40;
export const DEFAULT_GRID_WIDTH = 550;

const DEFAULT_STATE: GridState = {
  nodes: makeGridGraph(DEFAULT_NODES_PER_ROW, DEFAULT_GRID_WIDTH),
  barriers: [],
  start: undefined,
  end: undefined,
  status: "idle",
  delay: 0,
  size: DEFAULT_GRID_WIDTH,
  itemsPerRow: DEFAULT_NODES_PER_ROW,
};

export const gridReducer = createReducer<GridState>(DEFAULT_STATE, (builder) => {
  builder.addCase(initializeGraph, (state, action) => {
    state.status = "idle";
    state.barriers = [];
    state.start = undefined;
    state.end = undefined;
    state.size = action.payload.gridWidth;
    state.itemsPerRow = action.payload.numPerRow;
  });
  builder.addCase(changeNode, (state, action) => {
    console.log("changeNode");
    const { key, changes } = action.payload;
    // merge the changes with the initial properties
    const initialNode = state.nodes[key];
    const updatedNode = mergeRight(initialNode, changes);
    state.nodes[key] = updatedNode;

    if (changes.type && changes.type === "Start") {
      state.start = updatedNode;
    }
  });
  builder.addCase(replaceNodes, (state, action) => {
    state.nodes = action.payload;
  });
  builder.addCase(setStatus, (state, action) => {
    state.status = action.payload;
  });
  builder.addCase(resetNode, (state, action) => {
    const key = action.payload;
    const { size, itemsPerRow } = state;
    const node = state.nodes[key];
    if (!node) {
      console.warn("Reset Node Failed: Cannot find node");
      return;
    }
    const nodeSize = Math.floor(size / itemsPerRow);
    const [row, col] = parseNodeKey(key);
    state.nodes[key] = initializeNodeModel(row, col, nodeSize);
  });
});

export const gridSlice = createSlice<GridState, SliceCaseReducers<GridState>, "grid">({
  initialState: DEFAULT_STATE,
  reducers: { ...gridReducer },
  name: "grid",
});
