import { describe, it, expect } from "vitest";
import { DEFAULT_STATE, changeNode, gridSlice } from ".";

describe("Grid Slice", () => {
  it("updates node changes correctly", () => {
    const key = "0_1";
    const state = gridSlice.reducer(DEFAULT_STATE, changeNode({ key, changes: { type: "Start" } }));
    console.log(state.nodes[key]);
    expect(state.nodes[key]).toHaveProperty("type", "Start");
  });
});
