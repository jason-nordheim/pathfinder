import { describe, it, expect } from "vitest";
import { NODE_COLORS, NODE_TYPE, NodeModel, makeGrid } from "./NodeModel";

describe("NodeModel", () => {
  describe("NodeModel functionality", () => {
    it('starts the node off as "unparsed"', () => {
      const n = new NodeModel(1, 1, 10, 10);
      expect(n.type).toBe(NODE_TYPE.UNPARSED);
    });

    it("returns different colors for each node type", () => {
      const n = new NodeModel(1, 1, 10, 10);
      n.setType("Barrier");
      expect(n.getColor()).toBe(NODE_COLORS.BLACK);
      n.setType("Closed");
      expect(n.getColor()).toBe(NODE_COLORS.RED);
      n.setType("Open");
      expect(n.getColor()).toBe(NODE_COLORS.GREEN);
      n.setType("Start");
      expect(n.getColor()).toBe(NODE_COLORS.ORANGE);
      n.setType("End");
      expect(n.getColor()).toBe(NODE_COLORS.TURQUOISE);
      n.setType("Path");
      expect(n.getColor()).toBe(NODE_COLORS.PURPLE);
    });

    it("correctly defines its position in the grid", () => {
      const n = new NodeModel(4, 5, 10, 10);
      expect(n.x).toBe(4 * 10);
      expect(n.y).toBe(5 * 10);
      expect(n.getPosition()).toMatchObject([4, 5]);
    });

    it("can reset correctly", () => {
      const n = new NodeModel(2, 3, 10, 10);
      expect(n.type).toBe("Unparsed");
      n.setType("Barrier");
      n.reset();
      expect(n.type).toBe("Unparsed");
    });
  });

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

    it("makes each node the same size", () => {
      const firstNodeSize = grid[0][0].width;
      for (let r = 1; r < grid.length; r++) {
        for (let c = 1; c < grid[r].length; c++) {
          expect(grid[r][c].width).toBe(firstNodeSize);
        }
      }
    });
  });

  describe("node utils with grid", () => {
    it("does not include barriers when returning neighbors", () => {
      const grid = makeGrid(30, 500);
      grid[0][0].setType("Barrier");
      grid[0][1].setType("Barrier");
      grid[1][2].setType("Barrier");
      grid[1][1].setType("Start");
      grid[1][1].updateNeighbors(grid);
      const neighbors = grid[1][1].neighbors;
      expect(neighbors).toHaveLength(2);
    });

    it("returns all neighbors if no barriers", () => {
      const grid = makeGrid(30, 500);
      grid[2][2].updateNeighbors(grid);
      const neighbors = grid[2][2].neighbors;
      expect(neighbors).toHaveLength(4);
    });
  });
});
