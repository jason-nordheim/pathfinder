import { SliceCaseReducers, createReducer, createSlice } from "@reduxjs/toolkit";
import { GridState } from "./grid.common";
import { changeNode, initializeGraph, replaceNodes, resetNode, setStatus } from "./grid.actions";
import { mergeRight } from "rambda";
import { initializeNodeModel, makeGrid } from "../lib/NodeModel";

export const DEFAULT_NODES_PER_ROW = 40;
export const DEFAULT_GRID_WIDTH = 550;

const DEFAULT_STATE: GridState = {
  nodes: makeGrid(DEFAULT_NODES_PER_ROW, DEFAULT_GRID_WIDTH),
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
    const { row, column, changes } = action.payload;
    console.log({ changes });
    state.nodes[row][column] = mergeRight(state.nodes[row][column], changes);
  });
  builder.addCase(replaceNodes, (state, action) => {
    state.nodes = action.payload;
  });
  builder.addCase(setStatus, (state, action) => {
    state.status = action.payload;
  });
  builder.addCase(resetNode, (state, action) => {
    const { row, column } = action.payload;
    const { size, itemsPerRow } = state;
    const nodeSize = Math.floor(size / itemsPerRow);
    state.nodes[row][column] = initializeNodeModel(row, column, nodeSize);
  });
});

export const gridSlice = createSlice<GridState, SliceCaseReducers<GridState>, "grid">({
  initialState: DEFAULT_STATE,
  reducers: { ...gridReducer },
  name: "grid",
});
