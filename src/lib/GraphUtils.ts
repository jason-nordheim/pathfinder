export interface Graph {
  [key: string]: { [neighborKey: string]: number };
}

export function dijkstra(graph: Graph, startNode: string, endNode: string): string[] {
  const distances: { [key: string]: number } = {};
  const previousNodes: { [key: string]: { [neighborKey: string]: number } } = {};
  const queue: string[] = [];

  // Initialize distances and queue
  for (const node in graph) {
    const priority = node === startNode ? 0 : Infinity;
    distances[node] = priority;
    queue.push(node);
    queue.sort((a, b) => distances[a] - distances[b]);
  }

  while (queue.length > 0) {
    const key = queue.shift()!;

    if (key === endNode) {
      // Build and return the shortest path
      const shortestPath: string[] = [];
      let node = endNode;
      while (node !== null) {
        shortestPath.unshift(node);
        [node] = Object.keys(previousNodes[node])[0];
      }
      return shortestPath;
    }

    for (const neighbors in graph[key]) {
      const nodeDistance = distances[key]!;
      const allNeighbors = graph[neighbors];
      for (const neighbor in allNeighbors) {
        const neighborDistance = allNeighbors[neighbor];
        const estimatedDistance = nodeDistance + neighborDistance;
        if (estimatedDistance < distances[neighbor]) {
          distances[neighbor] = estimatedDistance;
          previousNodes[neighbors] = { [neighbor]: estimatedDistance };
          queue.push(neighbor);
          queue.sort((a, b) => distances[a] - distances[b]);
        }
      }
    }
  }

  return []; // No path found
}
