import { expect, test, describe } from "vitest";
import { dijkstra, makeNeighbors, makeNodeKey } from "./GraphUtils";

describe("Graph Utils", () => {
  describe("makeNeighbors()", () => {
    test("correctly makes neighbors for the position 0, 0", () => {
      const neighbors = makeNeighbors(0, 10, 0, 10);
      const keys = Object.keys(neighbors).sort();
      const expectedArray = ["0_1", "1_0", "1_1"].sort();
      expect(keys.length).toBe(3);
      expect(keys).toMatchObject(expectedArray);
    });
    test("correctly makes neighbors for position 10, 10 in 10x10 grid", () => {
      const neighbors = makeNeighbors(10, 10, 10, 10);
      const count = Object.keys(neighbors).sort();
      const expectedArray = ["9_10", "9_9", "10_9"].sort();
      expect(count.length).toBe(3);
      expect(count).toMatchObject(expectedArray);
    });
    test("correctly makes neighbors for a position in the middle of the grid", () => {
      const neighbors = makeNeighbors(5, 10, 5, 10);
      const keys = Object.keys(neighbors).sort();
      const expectedArray = ["4_5", "4_4", "4_6", "5_6", "5_4", "6_5", "6_4", "6_6"].sort();
      expect(keys.length).toBe(8);
      expect(keys).toMatchObject(expectedArray);
    });
  });

  describe("dijkstra", () => {
    const graph: { [k: string]: { [n: string]: number } } = {};
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        const key = makeNodeKey(i, j);
        graph[key] = makeNeighbors(i, 10, j, 10);
      }
    }
    test("correctly finds the path from 0,1 to 10,10", () => {
      const start = makeNodeKey(0, 1);
      const end = makeNodeKey(10, 10);
      const result = dijkstra(start, end, 10, 10);
      console.log(result);
    });
  });
});
