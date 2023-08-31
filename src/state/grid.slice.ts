import { SliceCaseReducers, createReducer, createSlice } from "@reduxjs/toolkit";
import { GridState } from "./grid.common";
import { changeNode, initializeGraph, replaceNodes, setStatus } from "./grid.actions";
import { mergeRight } from "rambda";

const DEFAULT_STATE: GridState = {
  grid: {
    nodes: [],
    barriers: [],
    status: "idle",
    delay: 0,
  },
};

export const gridReducer = createReducer<GridState>(DEFAULT_STATE, (builder) => {
  builder.addCase(initializeGraph, (state) => {
    state.grid.status = "idle";
    state.grid.barriers = [];
    state.grid.start = undefined;
    state.grid.end = undefined;
  });
  builder.addCase(changeNode, (state, action) => {
    const { row, column, changes } = action.payload;
    state.grid.nodes[row][column] = mergeRight(state.grid.nodes[row][column], changes);
  });
  builder.addCase(replaceNodes, (state, action) => {
    state.grid.nodes = action.payload;
  });
  builder.addCase(setStatus, (state, action) => {
    state.grid.status = action.payload;
  });
});

export const gridSlice = createSlice<GridState, SliceCaseReducers<GridState>, "grid">({
  initialState: DEFAULT_STATE,
  reducers: { grid: gridReducer },
  name: "grid",
});
