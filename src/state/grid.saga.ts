import { call, put, takeEvery, takeLatest, select, delay } from "redux-saga/effects";

import {
  HeuristicScore,
  NodeModel,
  NodeType,
  getNodeNeighbors,
  getNodePosition,
  isSameCoordinates,
  makeNodeKey,
} from "../lib/NodeModel";
import { GridGraph, GridState, OpenNode, sortPriority } from "./grid.common";
import { changeNode, searchGraph, setStatus } from "./grid.actions";

function* searchGraphSaga() {
  const nodes: GridGraph = yield select((state: GridState) => state.nodes);
  const start: NodeModel = yield select((state: GridState) => state.start);
  const end: NodeModel = yield select((state: GridState) => state.end);
  const size: number = yield select((state: GridState) => state.size);
  const delayMs: number = yield select((state: GridState) => state.delay);

  if (!start || !end) {
    console.warn("Missing either start or end node");
    return;
  }

  yield put(setStatus("working"));

  console.log("hi");
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

  // standardized method of updating a node type
  const changeNodeType = function* (key: string, newType: NodeType) {
    if (delayMs) {
      yield delay(delayMs);
    }
    yield put(changeNode({ key, changes: { type: newType } }));
  };

  // standardized method of adding a node
  const addNode = function* (node: NodeModel, count: number, priority: number) {
    const isStartPosition = isSameCoordinates(start!, node);
    const isEndPosition = isSameCoordinates(end!, node);
    if (!isStartPosition && !isEndPosition) {
      yield call(changeNodeType, node.key, "Open");
    }
    openSet.add(node);
    openNodes.push({ model: node, count, priority });
    // mimic priority queue
    openNodes.sort(sortPriority);
  };

  // start
  yield call(addNode, nodes[start.key]!, count, 0);

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
      const isEndNode = isSameCoordinates(current, end);
      if (isEndNode || current.type === "End") {
        let currentKey: string | undefined = current.key;
        while (currentKey && cameFrom.has(currentKey)) {
          if (nodes[currentKey].type !== "End") {
            // console.log("setting path", current);
            // listenerApi.dispatch(changeNode({ key: currentKey, changes: { type: "Path" } }));
            yield call(changeNodeType, currentKey, "Path");
          }
          currentKey = cameFrom.get(currentKey);
        }
        yield put(setStatus("finished"));
        return;
      }

      // have not reached the target node yet
      const currentKey = makeNodeKey(current);

      // inspect neighbors
      const neighbors = getNodeNeighbors(current, nodes, size);
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
            yield call(addNode, n, count, fScores.get(n.key)!);
          }
        }
      }

      if (!isSameCoordinates(current, start)) {
        yield call(changeNodeType, current.key, "Closed");
      }
    }
  }
  setStatus("finished");
}

export function* gridSaga() {
  yield takeLatest(searchGraph.type, searchGraphSaga);
}
