import {
  configureStore,
  createSlice,
  createAction,
  createReducer,
  SliceCaseReducers,
  createListenerMiddleware,
} from "@reduxjs/toolkit";
import { HeuristicScore, NodeModel, isSameCoordinates, makeGrid, makeNodeKey } from "../lib/NodeModel";
import { DeepPartial } from "ts-essentials";
import { mergeRight } from "rambda";

// types
type GridStatus = "working" | "idle" | "finished";
type OpenNode = { model: NodeModel; count: number; priority: number };
type GridState = {
  grid: {
    nodes: NodeModel[][];
    start?: NodeModel;
    end?: NodeModel;
    barriers: NodeModel[];
    status: GridStatus;
    delay: number;
  };
};
type InitializeGridParams = { size: number; width: number };
type ChangeNodeParams = { row: number; column: number; changes: DeepPartial<NodeModel> };

// utils
export const sortPriority = (a: OpenNode, b: OpenNode) =>
  a.priority === b.priority ? a.count - b.count : a.priority - b.priority;

// state
const DEFAULT_STATE: GridState = {
  grid: {
    nodes: [],
    barriers: [],
    status: "idle",
    delay: 0,
  },
};

// actions
const searchGraph = createAction("graph/search");
const replaceNodes = createAction<NodeModel[][]>("graph/replaceNodes");
const initializeGraph = createAction<InitializeGridParams>("graph/init");
const changeNode = createAction<ChangeNodeParams>("grid/changeNode");
const setStatus = createAction<GridStatus>("grid/setStatus");

// reducer
const gridReducer = createReducer<GridState>(DEFAULT_STATE, (builder) => {
  builder.addCase(initializeGraph, (state) => {
    state.grid.status = "idle";
    state.grid.barriers = [];
    state.grid.start = undefined;
    state.grid.end = undefined;
  });
  builder.addCase(changeNode, (state, action) => {
    const { row, column, changes } = action.payload;
    state.grid.nodes[row][column] = mergeRight(state.grid.nodes[row][column], changes);
  });
  builder.addCase(replaceNodes, (state, action) => {
    state.grid.nodes = action.payload;
  });
  builder.addCase(setStatus, (state, action) => {
    state.grid.status = action.payload;
  });
});

const gridSlice = createSlice<GridState, SliceCaseReducers<GridState>, "grid">({
  initialState: DEFAULT_STATE,
  reducers: { app: gridReducer },
  name: "grid",
});

const listenerMiddleware = createListenerMiddleware<GridState>();

listenerMiddleware.startListening({
  actionCreator: searchGraph,
  effect: async (_, listenerApi) => {
    const { nodes, delay, end, start } = listenerApi.getState().grid;
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
    const [x1, y1] = start.getPosition();
    const [x2, y2] = end.getPosition();
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
        current.updateNeighbors(nodes);
        for (const n of current.neighbors) {
          const neighborKey = makeNodeKey(n);
          const tentativeScore = gScores.get(currentKey)! + 1;
          if (tentativeScore < gScores.get(neighborKey)!) {
            cameFrom.set(neighborKey, currentKey);
            gScores.set(neighborKey, tentativeScore);
            const [x1, y1] = n.getPosition();
            const [x2, y2] = end.getPosition();
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

listenerMiddleware.startListening({
  actionCreator: initializeGraph,
  effect: async (action, listenerApi) => {
    const { size, width } = action.payload;
    const nodes = makeGrid(size, width);
    listenerApi.dispatch(replaceNodes(nodes));
  },
});

const store = configureStore({
  reducer: { grid: gridSlice.reducer },
});
