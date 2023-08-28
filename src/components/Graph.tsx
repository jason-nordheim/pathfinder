import { useRef, useState } from "react";
import { PriorityQueue } from "../lib/PriorityQueue";

const ROWS = 20;
const COLUMNS = 30;

const NODE_COLORS = {
  DEFAULT: "#faf5f5", // off white
  START: "#0cc916", // green
  END: "#c90c0f", // red
  VISITED: "#a9dbd9",
};

type NodePosition = { x: number; y: number };

const isNode = (x: number, y: number, node?: { x: number; y: number }) => {
  if (!node) return false;
  if (node.x === x && node.y === y) return true;
  return false;
};

const getNodeColor = (x: number, y: number, startNode?: NodePosition, endNode?: NodePosition) => {
  if (isNode(x, y, startNode)) {
    return NODE_COLORS.START;
  }
  if (isNode(x, y, endNode)) {
    return NODE_COLORS.END;
  }

  return NODE_COLORS.DEFAULT;
};

const makeNodeKey = (x: number, y: number) => {
  return `${x}_${y}`;
};

const getNeighbors = (x: number, y: number) => {
  const right = x + 1;
  const left = x - 1;
  const above = y + 1;
  const below = y - 1;
  const neighbors = [
    // RIGHT
    { x: right, y },
    { x: right, y: above },
    { x: right, y: below },
    // CENTER
    // skip => { x: x, y: y },
    { x: x, y: above },
    { x: x, y: below },
    // LEFT
    { x: left, y },
    { x: left, y: above }, // lower right
    { x: left, y: below }, // lower right
  ];
  return neighbors;
};

const findShortestPath = async (cancelToken: AbortSignal, start: NodePosition, end: NodePosition) => {
  new Promise((resolve, reject) => {
    const distances = new Map<string, number>();
    const previousNodes = new Map<string, NodePosition | null>();
    const queue = new PriorityQueue<NodePosition>();
    const visited = new Set<string>();

    // set the start node distance and enqueue it
    distances.set(makeNodeKey(start.x, start.y), 0);
    queue.enqueue(start, 0);

    while (!queue.isEmpty() && !cancelToken.aborted) {
      const current = queue.dequeue();
      if (cancelToken.aborted) {
        return reject();
      }
      if (!current) break;
      const currentNodeKey = makeNodeKey(current.x, current.y);

      // if the current node is the target node
      if (current === end) {
        const path: NodePosition[] = [];
        let node = end;

        while (node) {
          const key = makeNodeKey(node.x, node.y);
          path.unshift(node);
          node = previousNodes.get(key)!;
        }

        return resolve(path);
      }

      // not the target
      visited.add(currentNodeKey);

      // loop through the nodes we've seen so far and
      // if it has not been visited AND we do not know the distance from the start
      // set a tentative distance of
      const neighbors = getNeighbors(current.x, current.y);
      for (const neighbor of neighbors) {
        if (cancelToken.aborted) {
          return reject();
        }
        const neighborKey = makeNodeKey(neighbor.x, neighbor.y);
        const nodeVisited = visited.has(neighborKey);
        if (!nodeVisited) {
          console.log(`inspecting node at x:${neighbor.x},y:${neighbor.y}`);
          const tentativeDistance = nodeVisited ? distances.get(neighborKey)! + 1 : 1;
          console.log(`Tentative distance: ${tentativeDistance}`);
          distances.set(neighborKey, tentativeDistance);
          queue.enqueue(neighbor, tentativeDistance);
          previousNodes.set(neighborKey, current);
        } else {
          console.log(`already reviewed node at x:${neighbor.x}, y:${neighbor.y}`);
        }
      }
    }

    return resolve(undefined);
  });
};

type Status = "running" | "cancelled" | "complete" | "idle";

export const Graph = () => {
  const graphRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [abortController, setAbortController] = useState(new AbortController());
  const [startNode, setStartNode] = useState<NodePosition | undefined>(undefined);
  const [endNode, setEndNode] = useState<NodePosition | undefined>(undefined);
  const [visitedNodes, setVisitedNodes] = useState<Set<NodePosition>>(new Set());
  const [shortestPath, setShortestPath] = useState<NodePosition[] | undefined>(undefined);

  const handleAbort = () => {
    abortController.abort();
  };

  const handleNodeSelect = (x: number, y: number) => {
    if (isNode(x, y, startNode)) {
      setStartNode(undefined);
    } else if (isNode(x, y, endNode)) {
      setEndNode(undefined);
    } else if (!startNode) {
      setStartNode({ x, y });
    } else if (!endNode) {
      setEndNode({ x, y });
    }
  };

  const generateNodes = () => {
    const nodes = [];
    for (let i = 0; i < ROWS; i++) {
      for (let j = 0; j < COLUMNS; j++) {
        const color = getNodeColor(i, j, startNode, endNode);
        nodes.push(
          <div
            key={makeNodeKey(i, j)}
            style={{ border: "1px solid black", display: "grid", position: "relative", backgroundColor: color }}
            onClick={() => handleNodeSelect(i, j)}
          ></div>
        );
      }
    }
    return nodes;
  };

  const handleSearch = async () => {
    if (startNode && endNode && status === "idle") {
      try {
        setStatus("running");

        setStatus("complete");
      } catch (error) {
        if (error.name === "AbortError") {
          setStatus("cancelled");
        } else {
          setStatus("idle");
        }
      }
    } else if (!startNode || !endNode) {
      alert("You must select a start node and end node before finding the shortest path between nodes");
    }
  };

  return (
    <div style={{ display: "flex" }}>
      <div
        id="graph"
        ref={graphRef}
        style={{
          width: "600px",
          height: "400px",
          border: "1px solid black",
          display: "grid",
          gridTemplateColumns: `repeat(${COLUMNS}, 1fr)`,
          gridTemplateRows: `repeat(${ROWS}, 1fr)`,
        }}
      >
        {generateNodes()}
        {/* UI for adding nodes and edges */}
        {/* UI for selecting start and target nodes */}
        {/* UI for running Dijkstra's algorithm */}
        {/* Visual representation of the graph with nodes and edges */}
      </div>
      <aside>
        <button onClick={() => handleSearch()}>Dijkstra</button>
        <button onClick={() => handleAbort()}>Abort</button>
      </aside>
    </div>
  );
};

// const [nodes, setNodes] = useState<{ id: string; selected: boolean; x: number; y: number }[]>([]);
// const [edges, setEdges] = useState<{ source: string; target: string; weight: number }[]>([]);
// const [startNode, setStartNode] = useState<string | null>(null);
// const [targetNode, setTargetNode] = useState<string | null>(null);
// const [shortestPath, setShortestPath] = useState<{ id: string; selected: boolean }[]>([]);

// const handleAddNode = () => {
//   const { left, top, width, height } = graphRef.current!.getBoundingClientRect();
//   const centerX = Math.floor((left + width) / 2);
//   const centerY = Math.floor((top + height) / 2);

//   const newNode = {
//     id: `${nodes.length + 1}`,
//     selected: false,
//     x: centerX,
//     y: centerY,
//   };
//   setNodes([...nodes, newNode]);
// };

// const handleAddEdge = (nodeId: string) => {
//   if (startNode === null) {
//     setStartNode(nodeId);
//   } else if (targetNode === null && nodeId !== startNode) {
//     setTargetNode(nodeId);
//     const newEdge = {
//       source: startNode,
//       target: nodeId,
//       weight: Math.floor(Math.random() * 10) + 1, // Random edge weight for illustration
//     };
//     setEdges([...edges, newEdge]);
//   } else {
//     setStartNode(null);
//     setTargetNode(null);
//   }
// };
