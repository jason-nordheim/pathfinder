export const makeNodeKey = (row: number, column: number) => `${row}_${column}`;

export const makeNeighbors = (row: number, totalRows: number, column: number, totalColumns: number) => {
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
  if (above >= 0) {
    const aboveKey = makeNodeKey(above, column);
    neighbors[aboveKey] = Infinity;
  }

  if (below <= totalRows) {
    const belowKey = makeNodeKey(below, column);
    neighbors[belowKey] = Infinity;
  }

  return neighbors;
};

export interface Graph {
  [key: string]: { [neighborKey: string]: number };
}

// export function dijkstra(graph: Graph, startNode: string, endNode: string): string[] {
//   const distances: { [key: string]: number } = {};
//   const previousNodes: { [key: string]: { [neighborKey: string]: number } } = {};
//   const queue: string[] = [];

//   // Initialize distances and queue
//   for (const node in graph) {
//     const priority = node === startNode ? 0 : Infinity;
//     distances[node] = priority;
//     queue.unshift(node);
//     queue.sort((a, b) => distances[a] - distances[b]);
//   }

//   while (queue.length > 0) {
//     const key = queue.shift()!;

//     if (key === endNode) {
//       // Build and return the shortest path
//       const shortestPath: string[] = [];
//       let node: string | null = endNode;
//       while (node !== null) {
//         shortestPath.unshift(node);
//         node = Object.keys(previousNodes[node])![0] || null;
//       }
//       return shortestPath;
//     }

//     for (const neighbors in graph[key]) {
//       const nodeDistance = distances[key]!;
//       const allNeighbors = graph[neighbors];
//       for (const neighbor in allNeighbors) {
//         const neighborDistance = allNeighbors[neighbor];
//         const estimatedDistance = nodeDistance + neighborDistance;
//         if (estimatedDistance < distances[neighbor]) {
//           distances[neighbor] = estimatedDistance;
//           previousNodes[neighbors] = { [neighbor]: estimatedDistance };
//           queue.push(neighbor);
//           queue.sort((a, b) => distances[a] - distances[b]);
//         }
//       }
//     }
//   }

//   return []; // No path found
// }

const makeGraph = (rows: number, columns: number) => {
  const graph: Graph = {};
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < columns; j++) {
      const key = makeNodeKey(i, j);
      graph[key] = makeNeighbors(i, 10, j, 10);
    }
  }
  return graph;
};

export const dijkstra = (start: string, end: string, rows: number, columns: number) => {
  const graph = makeGraph(rows, columns);

  const queue: string[] = [];
  // key === nodeKey, value === distance 
  const knownDistances = new Map<string, number>();
  // key === fromNodeKey, value === toNodeKey
  const previousNodes = new Map<string, string>();

  knownDistances.set(start, 0);
  const startNeighbors = graph[start];
  for (const n in startNeighbors) {
    knownDistances.set(n, 1);
    previousNodes.set(start, n);
  }
  queue.push(start);
  queue.sort((a, b) => (knownDistances.get(a) || 0) - (knownDistances.get(b) || 0));

  while (queue && queue.length) {
    const curr = queue.shift()!;
    console.log(`inspecting ${curr}`);

    // if the current node is the target...
    console.log(`isTarget: ${curr === end}`);
    if (curr === end) {
      const path: string[] = [];
      let node: string | undefined = end;

      while (node) {
        path.unshift(node);
        node = previousNodes.get(node);
      }

      return path;
    }

    // not the target
    const neighbors = graph[curr];
    const currentDistance = knownDistances.get(curr)!;
    for (const n in neighbors) {
      console.log(`inspecting neighbor: ${n}`);
      const nDistance = knownDistances.get(n);
      console.log({ nDistance });
      // we've already calculated the distance
      if (!nDistance) {
        const previousKey = previousNodes.get(curr)!;
        const previousNodeDistance = knownDistances.get(previousKey)!;
        const tentativeDistance = previousNodeDistance + currentDistance;
        console.log({ previousKey, previousNodeDistance, tentativeDistance });
        knownDistances.set(n, tentativeDistance);
        queue.push(n);
        queue.sort((a, b) => (knownDistances.get(a) || 0) - (knownDistances.get(b) || 0));
      } else {
        console.log('adding new distance');
        knownDistances.set(n, currentDistance + 1);
        queue.push(n);
        queue.sort((a, b) => (knownDistances.get(a) || 0) - (knownDistances.get(b) || 0));
      }
    }
  }

  return undefined;
};
