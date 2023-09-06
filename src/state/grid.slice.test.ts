import { describe, it, expect } from "vitest";
import { DEFAULT_STATE, gridReducer } from "./grid.slice";
import { changeNode } from "./grid.actions";
import { NODE_TYPE } from "../lib/NodeModel";

describe("Grid Slice", () => {
  it.each(Object.values(NODE_TYPE))("updates node changes correctly for type: %s", (type) => {
    const key = "0_1";
    const state = gridReducer(DEFAULT_STATE, changeNode({ key, changes: { type } }));
    expect(state.nodes[key]).toHaveProperty("type", type);
  });
});
