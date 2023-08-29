import React, { useState } from "react";
import "./Grid.css";
import { Graph, dijkstra, makeNeighbors } from "../lib/GraphUtils";

const numRows = 40;
const numCols = 60;

type AppStatus = "idle" | "running" | "complete" | "aborted";

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
