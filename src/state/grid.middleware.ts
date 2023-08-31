import { createListenerMiddleware } from "@reduxjs/toolkit";
import { GridState, OpenNode, sortPriority } from "./grid.common";
import { changeNode, initializeGraph, replaceNodes, searchGraph, setBarriers, setStatus } from "./grid.actions";
import {
  HeuristicScore,
  NodeModel,
  getNodeNeighbors,
  getNodePosition,
  isSameCoordinates,
  makeGrid,
  makeNodeKey,
} from "../lib/NodeModel";

const gridMiddleware = createListenerMiddleware<{ grid: GridState }>();

/** A* Pathfinding  */
gridMiddleware.startListening({
  actionCreator: searchGraph,
  effect: async (_, listenerApi) => {
    const { nodes, delay, end, start } = listenerApi.getState().grid.grid;
    // guard
    if (!end || !start) {
      console.warn("Missing either start or end node");
      return;
    }

    listenerApi.dispatch(setStatus("working"));

    let count = 0;
    const openNodes: OpenNode[] = [];
    const openSet = new Set<NodeModel>();
    const cameFrom = new Map<string, string>();
    const gScores = new Map<string, number>();
    const fScores = new Map<string, number>();

    // setup Infinity as default values for all nodes
    for (let i = 0; i < nodes.length; i++) {
      for (let j = 0; j < nodes[i].length; j++) {
        const key = makeNodeKey(nodes[i][j]);
        gScores.set(key, Infinity);
        fScores.set(key, Infinity);
      }
    }

    // standardize adding to the queue
    const addNode = (node: NodeModel, count: number, priority: number) => {
      const notStartPos = !isSameCoordinates(start!, node);
      const notEndPos = !isSameCoordinates(end!, node);
      if (notStartPos && notEndPos) {
        listenerApi.dispatch(changeNode({ row: node.row, column: node.column, changes: { type: "Open" } }));
      }
      openSet.add(node);
      openNodes.push({ model: node, count, priority });
      // mimic priority queue
      openNodes.sort(sortPriority);
    };

    // start
    addNode(start, count, 0);

    // set the g score for the start node
    const startKey = makeNodeKey(start);
    gScores.set(startKey, 0);

    // estimate the distance from the start node to the end node
    const [x1, y1] = getNodePosition(start);
    const [x2, y2] = getNodePosition(end);
    fScores.set(startKey, HeuristicScore(x1, y1, x2, y2));

    while (openNodes.length) {
      const openNode = openNodes.shift();
      if (openNode?.model) {
        const current = openNode.model;
        openSet.delete(current);

        // we've found the target node
        if (isSameCoordinates(current, end)) {
          let currentKey: string | undefined = makeNodeKey(current);
          while (currentKey && cameFrom.has(currentKey)) {
            listenerApi.delay(delay);
            const isStartOrEnd = isSameCoordinates(start, current) || isSameCoordinates(end, current);
            if (!isStartOrEnd) {
              listenerApi.dispatch(changeNode({ row: current.row, column: current.column, changes: { type: "Path" } }));
            }
            const nextKey = cameFrom.get(currentKey);
            currentKey = nextKey;
          }
          setStatus("finished");
          return;
        }

        // have not reached the target node yet
        const currentKey = makeNodeKey(current);

        // inspect neighbors
        const neighbors = getNodeNeighbors(current, nodes);
        for (const n of neighbors) {
          const neighborKey = makeNodeKey(n);
          const tentativeScore = gScores.get(currentKey)! + 1;
          if (tentativeScore < gScores.get(neighborKey)!) {
            cameFrom.set(neighborKey, currentKey);
            gScores.set(neighborKey, tentativeScore);
            const [x1, y1] = getNodePosition(n);
            const [x2, y2] = getNodePosition(end);
            fScores.set(neighborKey, tentativeScore + HeuristicScore(x1, y1, x2, y2));
            if (openSet.has(n)) {
              count++;
              addNode;
            }
          }
        }

        if (!isSameCoordinates(current, start)) {
          listenerApi.dispatch(changeNode({ row: current.row, column: current.column, changes: { type: "Closed" } }));
        }
      }
    }
    setStatus("finished");
  },
});

/** on initialize graph, recreate the nodes:
 *  executed as an effect to run async as this could
 *  execute slowly if the graph is large enough
 */
gridMiddleware.startListening({
  actionCreator: initializeGraph,
  effect: async (action, listenerApi) => {
    const { gridWidth, numPerRow } = action.payload;
    const nodes = makeGrid(numPerRow, gridWidth);
    listenerApi.dispatch(replaceNodes(nodes));
  },
});

/** check for barriers when replacing nodes */
// gridMiddleware.startListening({
//   actionCreator: replaceNodes,
//   effect: async (action, listenerApi) => {
//     const barriers: NodeModel[] = [];
//     action.payload.forEach((row) => {
//       row.forEach((node) => {
//         if (node.type === "Barrier") {
//           barriers.push(node);
//         }
//       });
//     });
//     listenerApi.dispatch(setBarriers(barriers));
//   },
// });

/** on change of node, check the nodes in the grid and update the barriers */
gridMiddleware.startListening({
  actionCreator: changeNode,
  effect: async (action, listenerApi) => {
    if (action.payload.changes?.type === "Barrier") {
      const nodes = listenerApi.getState().grid.grid.nodes;
      const barriers: NodeModel[] = [];
      nodes.forEach((row) => {
        row.forEach((node) => {
          if (node.type === "Barrier") {
            barriers.push(node);
          }
        });
      });
      listenerApi.dispatch(setBarriers(barriers));
    }
  },
});

export { gridMiddleware };
