import { describe, it, expect } from "vitest";
import { makeGrid } from "./NodeModel";

describe("NodeModel", () => {
  describe("makeGrid", () => {
    const grid = makeGrid(10, 500);
    it("creates the expected number of rows", () => {
      expect(grid).toHaveLength(10);
    });
    it("creates the expected number of columns", () => {
      grid.forEach((row) => expect(row).toHaveLength(10));
    });

    it("fills the entire grid", () => {
      for (let r = 0; r < 10; r++) {
        for (let c = 0; c < 10; c++) {
          expect(grid[r][c]).toBeDefined();
        }
      }
    });
  });
});
