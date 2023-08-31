import { createListenerMiddleware } from "@reduxjs/toolkit";
import { GridState, OpenNode, sortPriority } from "./grid.common";
import { changeNode, initializeGraph, replaceNodes, searchGraph, setBarriers, setStatus } from "./grid.actions";
import {
  HeuristicScore,
  KeyedNodePosition,
  NodeModel,
  getNodeNeighbors,
  getNodePosition,
  isSameCoordinates,
  makeGridGraph,
  makeNodeKey,
} from "../lib/NodeModel";

const gridMiddleware = createListenerMiddleware<{ grid: GridState }>();

/** A* Pathfinding  */
gridMiddleware.startListening({
  actionCreator: searchGraph,
  effect: async (_, listenerApi) => {
    const { nodes, delay, end, start, size } = listenerApi.getState().grid;
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
    const allNodes = Object.values(nodes);
    for (const node of allNodes) {
      gScores.set(node.key, Infinity);
      fScores.set(node.key, Infinity);
    }

    // standardize adding to the queue
    const addNode = (node: NodeModel, count: number, priority: number) => {
      const notStartPos = !isSameCoordinates(start!, node);
      const notEndPos = !isSameCoordinates(end!, node);
      if (notStartPos && notEndPos) {
        listenerApi.dispatch(changeNode({ key: node.key, changes: { type: "Open" } }));
      }
      openSet.add(node);
      openNodes.push({ model: node, count, priority });
      // mimic priority queue
      openNodes.sort(sortPriority);
    };

    // start
    addNode(nodes[start.key]!, count, 0);

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
          let currentKey: string | undefined = current.key;
          while (currentKey && cameFrom.has(currentKey)) {
            listenerApi.delay(delay);
            const isStartOrEnd = isSameCoordinates(start, current) || isSameCoordinates(end, current);
            if (!isStartOrEnd) {
              listenerApi.dispatch(changeNode({ key: current.key, changes: { type: "Path" } }));
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
        const neighbors = getNodeNeighbors(current, nodes, size);
        for (const n of neighbors) {
          const tentativeScore = gScores.get(currentKey)! + 1;
          if (tentativeScore && n?.key && tentativeScore < gScores.get(n?.key)!) {
            cameFrom.set(n.key, currentKey);
            gScores.set(n.key, tentativeScore);
            const [x1, y1] = getNodePosition(n);
            const [x2, y2] = getNodePosition(end);
            fScores.set(n.key, tentativeScore + HeuristicScore(x1, y1, x2, y2));
            if (openSet.has(n)) {
              count++;
              addNode;
            }
          }
        }

        if (!isSameCoordinates(current, start)) {
          listenerApi.dispatch(changeNode({ key: current.key, changes: { type: "Closed" } }));
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
    const nodes = makeGridGraph(numPerRow, gridWidth);
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
// gridMiddleware.startListening({
//   actionCreator: changeNode,
//   effect: async (action, listenerApi) => {
//     const { changes, key } = action.payload;
//     const barriers: KeyedNodePosition[] = [];
//     const nodes = listenerApi.getState().grid.nodes;
//     const targetNode = nodes[key]!;
//     const updatedNodes = { ...nodes };
//     Object.forEach((n) => {
//       if (n.type === "Barrier") {
//         barriers.push({ ...n });
//       }
//     });
//     updatedNodes.set(key, { ...targetNode, ...changes });
//     listenerApi.dispatch(replaceNodes(updatedNodes));
//     listenerApi.dispatch(setBarriers(barriers));
//   },
// });

export { gridMiddleware };
