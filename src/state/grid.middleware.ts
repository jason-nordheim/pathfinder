import { createListenerMiddleware } from "@reduxjs/toolkit";
import { GridState, OpenNode, sortPriority } from "./grid.common";
import { changeNode, replaceNodes, searchGraph, setBarriers, setStatus } from "./grid.actions";
import {
  HeuristicScore,
  KeyedNodePosition,
  NodeModel,
  NodeType,
  getNodeNeighbors,
  getNodePosition,
  isSameCoordinates,
  makeNodeKey,
} from "../lib/NodeModel";

const gridMiddleware = createListenerMiddleware<GridState>();

/** A* Pathfinding  */
gridMiddleware.startListening({
  actionCreator: searchGraph,
  effect: async (_, listenerApi) => {
    const { nodes, delay, end, start, itemsPerRow } = listenerApi.getState();
    // guard
    if (end === undefined || start === undefined) {
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

    const changeNodeType = async (key: string, newType: NodeType) => {
      await listenerApi.delay(delay + 1);
      await listenerApi.dispatch(changeNode({ key, changes: { type: newType } }));
    };

    // standardize adding to the queue
    const addNode = async (node: NodeModel, count: number, priority: number) => {
      const isStartPosition = isSameCoordinates(start!, node);
      const isEndPosition = isSameCoordinates(end!, node);
      if (!isStartPosition && !isEndPosition) {
        await changeNodeType(node.key, "Open");
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

    let done = false;

    while (openNodes.length && !done) {
      const openNode = openNodes.shift();
      if (openNode?.model) {
        const current = openNode.model;
        openSet.delete(current);

        // we've found the target node
        const isEndNode = isSameCoordinates(current, end);
        if (isEndNode || current.type === "End") {
          let currentKey: string | undefined = current.key;
          while (currentKey && cameFrom.has(currentKey)) {
            if (nodes[currentKey].type !== "End") {
              await changeNodeType(currentKey, "Path");
            }
            currentKey = cameFrom.get(currentKey);
          }
          listenerApi.dispatch(setStatus("finished"));
          done = true;
        }

        // have not reached the target node yet
        const currentKey = makeNodeKey(current);

        // inspect neighbors
        const neighbors = getNodeNeighbors(current, nodes, itemsPerRow);
        for (const n of neighbors) {
          const gScoreCurrentNode = gScores.get(currentKey);
          const tentativeScore = gScoreCurrentNode! + 1;
          if (tentativeScore && n?.key && tentativeScore < gScores.get(n.key)!) {
            cameFrom.set(n.key, currentKey);
            gScores.set(n.key, tentativeScore);
            const [x1, y1] = getNodePosition(n);
            const [x2, y2] = getNodePosition(end);
            const fScore = tentativeScore + HeuristicScore(x1, y1, x2, y2);
            console.log(fScore);
            fScores.set(n.key, fScore);
            if (!openSet.has(n)) {
              count++;
              await addNode(n, count, fScores.get(n.key)!);
            }
          }
        }

        if (!isSameCoordinates(current, start) && !done) {
          await changeNodeType(current.key, "Closed");
        }
      }
      listenerApi.dispatch(setStatus("finished"));
    }
  },
});

// /** on initialize graph, recreate the nodes:
//  *  executed as an effect to run async as this could
//  *  execute slowly if the graph is large enough
//  */
// gridMiddleware.startListening({
//   actionCreator: initializeGraph,
//   effect: async (action, listenerApi) => {
//     const { numPerRow } = action.payload;
//     const nodes = makeGridGraph(numPerRow, gridWidth);
//     listenerApi.dispatch(replaceNodes(nodes));
//   },
// });

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
    const { changes, key } = action.payload;
    const barriers: KeyedNodePosition[] = [];
    const nodes = listenerApi.getState().nodes;
    const targetNode = nodes[key]!;
    const updatedNodes = { ...nodes };
    Object.values(nodes).forEach((n) => {
      if (n.type === "Barrier") {
        barriers.push({ ...n });
      }
    });
    updatedNodes[key] = { ...targetNode, ...changes };
    listenerApi.dispatch(replaceNodes(updatedNodes));
    listenerApi.dispatch(setBarriers(barriers));
  },
});

export { gridMiddleware };
