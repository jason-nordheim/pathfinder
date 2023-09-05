import { useCallback, useEffect, useMemo, useState } from "react";

type Position = {
  x: number;
  y: number;
};

type GridPosition = {
  row: number;
  column: number;
};

type GraphStatus = "ready" | "working" | "failed" | "complete";

export type VertexType = "Unknown" | "Start" | "End" | "Barrier" | "Closed" | "Open" | "Path";

export type Vertex = Position &
  GridPosition & {
    type?: VertexType;
  };

export const makeVertexKey = (row: number, col: number) => `${row}_${col}`;
const parseVertexKey = (key: string) => key.split("_").map(Number);

const getNeighbors = (row: number, column: number, graph: Vertex[][]) => {
  const neighbors = [];
  // down
  if (row < graph.length - 1 && graph[row + 1][column].type !== "Barrier") {
    neighbors.push(graph[row + 1][column]);
  }
  // up
  if (row > 0 && graph[row - 1][column].type !== "Barrier") {
    neighbors.push(graph[row - 1][column]);
  }
  // right
  if (column < graph.length - 1 && graph[row][column + 1].type !== "Barrier") {
    neighbors.push(graph[row][column + 1]);
  }
  // left
  if (column > 0 && graph[row][column - 1].type !== "Barrier") {
    neighbors.push(graph[row][column - 1]);
  }
  return neighbors;
};

const estimateDistance = (a: Position, b: Position) => {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
};

type VertexOpenQueue = Array<{ count: number; priority: number; vertex: Vertex }>;

export const useVertices = (itemsPerRow: number, gridWidthInPixels: number) => {
  const [status, setStatus] = useState<GraphStatus>("working");
  const [graph, setGraph] = useState<Vertex[][]>([]);

  const vertexSize = useMemo(() => Math.floor(gridWidthInPixels / itemsPerRow), [gridWidthInPixels, itemsPerRow]);

  const { start, end } = useMemo(() => {
    let startVertex: Vertex | undefined = undefined,
      endVertex: Vertex | undefined = undefined;
    for (let i = 0; i < graph.length; i++) {
      for (let j = 0; j < graph[i].length; j++) {
        if (graph[i][j].type === "Start") {
          startVertex = graph[i][j];
        } else if (graph[i][j].type === "End") {
          endVertex = graph[i][j];
        }
      }
    }
    return { start: startVertex, end: endVertex };
  }, [graph]);

  // initialize the graph
  useEffect(() => {
    const graph: Vertex[][] = [];
    for (let row = 0; row < itemsPerRow; row++) {
      graph.push([]);
      for (let col = 0; col < itemsPerRow; col++) {
        const x = row * vertexSize;
        const y = col * vertexSize;
        const v: Vertex = { x, y, row, column: col, type: "Unknown" };
        graph[row].push(v);
      }
    }
    setGraph(graph);
    setStatus("ready");
  }, [vertexSize, itemsPerRow]);

  // callback function to change a node
  const changeNodeType = useCallback(
    (newType: VertexType, atPosition: GridPosition) => {
      if ((newType === "Start" && start == undefined) || (end === undefined && newType == "End")) {
        const { row, column } = atPosition;
        const graphCopy: Vertex[][] = structuredClone(graph);
        console.log(graphCopy);
        const updatedVertex = graphCopy[row][column];
        console.log({ updatedVertex });
        updatedVertex.type = newType;
        graphCopy[row][column] = updatedVertex;
        setGraph(graphCopy);
      }
    },
    // purposely excluding graph
    // eslint-disable-next-line
    [start, end]
  );

  const findShortestPath = useCallback(() => {
    if (start && end) {
      let count = 0;
      const openHash = new Set<Vertex>();
      const openQueue: VertexOpenQueue = [];
      const cameFrom = new Map<string, string>();
      const gScores = new Map<string, number>();
      const fScores = new Map<string, number>();

      for (let row = 0; row < graph.length; row++) {
        for (let col = 0; col < graph[row].length; col++) {
          const key = makeVertexKey(row, col);
          gScores.set(key, Infinity);
          fScores.set(key, Infinity);
        }
      }

      const addVertexToQueue = (vertex: Vertex, count: number, priority: number) => {
        const existingVertexDef = graph[vertex.row][vertex.column];
        if (existingVertexDef.type !== "End" && existingVertexDef.type !== "Start") {
          changeNodeType("Open", { row: vertex.row, column: vertex.column });
        }
        openHash.add(vertex);
        openQueue.push({ vertex, priority, count });
        openQueue.sort((a, b) => {
          if (a.priority == b.priority) return a.count - b.count;
          return a.priority - b.priority;
        });
      };

      const closeNode = (vertex: Vertex) => {
        const existingVertexDef = graph[vertex.row][vertex.column];
        if (existingVertexDef.type !== "End" && existingVertexDef.type !== "Start") {
          changeNodeType("Open", { row: vertex.row, column: vertex.column });
        }
      };

      addVertexToQueue(graph[start.row][start.column], count, 0);
      const startKey = makeVertexKey(start.row, start.column);
      gScores.set(startKey, 0);
      const estimatedDistance = estimateDistance(start, end);
      fScores.set(startKey, estimatedDistance);

      while (openQueue.length) {
        const current = openQueue.shift();
        if (current) {
          openHash.delete(current.vertex);

          // make the path
          if (current.vertex.type == "End") {
            let currentVertexKey: string | undefined = makeVertexKey(current.vertex.row, current.vertex.column);
            while (currentVertexKey && cameFrom.has(currentVertexKey)) {
              const [row, column] = parseVertexKey(currentVertexKey);
              changeNodeType("Path", { row, column });
              currentVertexKey = cameFrom.get(currentVertexKey);
            }
            setStatus("complete");
            return;
          }

          const neighbors = getNeighbors(current.vertex.row, current.vertex.column, graph);
          const currentKey = makeVertexKey(current.vertex.row, current.vertex.column);

          // inspect neighbors
          for (const n of neighbors) {
            const neighborKey = makeVertexKey(n.row, n.column);
            const currentScore = gScores.get(currentKey);
            const neighborScore = gScores.get(neighborKey);
            if (currentScore && neighborScore && currentScore + 1 < neighborScore) {
              cameFrom.set(neighborKey, currentKey);
              gScores.set(neighborKey, currentScore + 1);
              const fScore = estimateDistance(end, n);
              fScores.set(neighborKey, currentScore + 1 + fScore);
              if (!openHash.has(n)) {
                count++;
                addVertexToQueue(n, count, fScores.get(neighborKey)!);
              }
            }
          }

          closeNode(current.vertex);
        }
      }
      setStatus("failed");
    }
  }, []);

  return { graph, findShortestPath, changeNodeType, status, vertexSize, start, end };
};
