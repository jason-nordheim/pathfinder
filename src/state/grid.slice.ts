import { SliceCaseReducers, createReducer, createSlice } from "@reduxjs/toolkit";
import { GridState } from "./grid.common";
import { changeNode, initializeGraph, replaceNodes, resetNode, setStatus } from "./grid.actions";

import { initializeNodeModel, makeGridGraph, parseNodeKey } from "../lib/NodeModel";

export const DEFAULT_NODES_PER_ROW = 40;

export const DEFAULT_STATE: GridState = {
  nodes: makeGridGraph(DEFAULT_NODES_PER_ROW),
  barriers: [],
  start: undefined,
  end: undefined,
  status: "idle",
  delay: 0,
  itemsPerRow: DEFAULT_NODES_PER_ROW,
  updates: 0,
};

export const gridReducer = createReducer<GridState>(DEFAULT_STATE, (builder) => {
  builder
    .addCase(initializeGraph, (state, action) => {
      state.nodes = makeGridGraph(action.payload.numPerRow);
      state.status = "idle";
      state.barriers = [];
      state.start = undefined;
      state.end = undefined;
      state.itemsPerRow = action.payload.numPerRow;
      state.updates = 0;
    })
    .addCase(changeNode, (state, action) => {
      if (state.status === "working") return;
      const { key, changes } = action.payload;
      // merge the changes with the initial properties
      const initialNode = state.nodes[key];
      const updatedNode = { ...initialNode, ...changes };
      state.nodes[key] = updatedNode;

      if (changes.type && changes.type === "Start") {
        state.start = updatedNode;
      } else if (changes.type && changes.type === "End") {
        state.end = updatedNode;
      }
    })
    .addCase(replaceNodes, (state, action) => {
      state.nodes = action.payload;
      state.updates = state.updates++;
    })
    .addCase(setStatus, (state, action) => {
      state.status = action.payload;
    })
    .addCase(resetNode, (state, action) => {
      const key = action.payload;
      const node = state.nodes[key];
      if (!node) {
        console.warn("Reset Node Failed: Cannot find node");
      } else {
        const [row, col] = parseNodeKey(key);
        state.nodes[key] = initializeNodeModel(row, col);
      }
    });
});

export const gridSlice = createSlice<GridState, SliceCaseReducers<GridState>, "grid">({
  initialState: DEFAULT_STATE,
  reducers: { ...gridReducer },
  name: "grid",
});
