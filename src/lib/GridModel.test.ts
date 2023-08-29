import { describe, expect, it } from "vitest";
import { GridModel } from "./GridModel";
describe("Grid Model", () => {
  it("can find the path between two nodes", () => {
    const model = new GridModel(10, 10);
    const start = model.makeNodeKey(1, 1);
    const end = model.makeNodeKey(10, 5);
    const result = model.dijkstra(start, end);
    expect(result).toBeDefined();
    expect(result?.length).toBeGreaterThan(1);
    console.log(result);
  });
});
