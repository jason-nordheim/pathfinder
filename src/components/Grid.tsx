import React, { useState } from "react";
import "./Grid.css";
import { Graph, dijkstra } from "../lib/GraphUtils";

const numRows = 40;
const numCols = 60;

type AppStatus = "idle" | "running" | "complete" | "aborted";

const makeNodeKey = (row: number, column: number) => `${row}-${column}`;

const makeNeighbors = (row: number, totalRows: number, column: number, totalColumns: number) => {
  const left = column - 1;
  const right = column + 1;
  const above = row - 1;
  const below = row + 1;

  const neighbors: { [k: string]: number } = {};

  // nodes to the left
  if (left >= 0) {
    const leftKey = makeNodeKey(row, left);
    neighbors[leftKey] = Infinity;
    if (above >= 0) {
      const aboveLeftKey = makeNodeKey(above, left);
      neighbors[aboveLeftKey] = Infinity;
    }
    if (below <= totalRows) {
      const belowLeft = makeNodeKey(below, left);
      neighbors[belowLeft] = Infinity;
    }
  }

  // nodes to the right
  if (right <= totalColumns) {
    const rightKey = makeNodeKey(row, right);
    neighbors[rightKey] = Infinity;
    if (above >= 0) {
      const aboveRight = makeNodeKey(above, right);
      neighbors[aboveRight] = Infinity;
    }
    if (below <= totalRows) {
      const belowRight = makeNodeKey(below, right);
      neighbors[belowRight] = Infinity;
    }
  }

  // center
  if (above >= -1) {
    const aboveKey = makeNodeKey(above, column);
    neighbors[aboveKey] = Infinity;
  }

  if (below <= totalColumns) {
    const belowKey = makeNodeKey(below, column);
    neighbors[belowKey] = Infinity;
  }

  return neighbors;
};

export const Grid: React.FC = () => {
  const [appStatus, setAppStatus] = useState<AppStatus>("idle");
  const [startNode, setStartNode] = useState<string | null>(null);
  const [endNode, setEndNode] = useState<string | null>(null);
  const [shortestPath, setShortestPath] = useState<string[]>([]);

  const gridItems: JSX.Element[] = [];
  const graph: Graph = {}; // Define and populate your graph here

  // Function to handle cell click
  const handleCellClick = (row: number, col: number) => {
    const nodeKey = `${row}-${col}`;
    if (!startNode) {
      setStartNode(nodeKey);
    } else if (!endNode && nodeKey !== startNode) {
      setEndNode(nodeKey);
    }
  };

  const handleRun = () => {
    if (startNode && endNode) {
      setAppStatus("running");
      const path = dijkstra(graph, startNode, endNode);
      console.log(path);
      setShortestPath(path);
      setAppStatus("complete");
    }
  };

  // Generate grid items with click event listeners
  for (let row = 0; row < numRows; row++) {
    for (let col = 0; col < numCols; col++) {
      const nodeKey = `${row}-${col}`;
      const classNames = `grid-item ${nodeKey === startNode ? "start" : ""} ${nodeKey === endNode ? "end" : ""} ${
        shortestPath.includes(nodeKey) ? "path" : ""
      } ${graph[nodeKey] ? "visited" : ""}`;
      gridItems.push(<div key={nodeKey} className={classNames} onClick={() => handleCellClick(row, col)}></div>);
      graph[nodeKey] = makeNeighbors(row, col, numRows, numCols);
    }
  }

  return (
    <>
      <div className="grid-container">{gridItems}</div>
      <button disabled={appStatus !== "idle"} onClick={() => handleRun()}>
        {appStatus === "idle" ? "Run" : appStatus}
      </button>
    </>
  );
};

export default Grid;
