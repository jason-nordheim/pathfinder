import { CSSProperties, FC, MouseEventHandler, useEffect, useId, useMemo, useState } from "react";
import { HeuristicScore, NodeModel, NodeType, algorithm, makeGrid, makeNodeKey, parseNodeKey } from "../lib/NodeModel";
import { ValueOf } from "ts-essentials";

const STATUS = {
  IDLE: "idle",
  RUNNING: "running",
  COMPLETE: "complete",
};

type GridStatus = ValueOf<typeof STATUS>;
type OpenSetItem = { model: NodeModel; count: number; priority: number };

const GridNode: FC<{ model: NodeModel; onClick: MouseEventHandler; onContextMenu: MouseEventHandler }> = ({
  model,
  onClick,
  onContextMenu,
}) => {
  const style: CSSProperties = {
    position: "absolute",
    top: model.x,
    left: model.y,
    height: model.width,
    width: model.width,
    backgroundColor: model.getColor(),
    border: "1px solid gray",
  };
  return <div className="node" style={style} onClick={onClick} onContextMenu={onContextMenu}></div>;
};

export const Grid: FC<{ size: number; width: number }> = ({ size, width }) => {
  const [status, setStatus] = useState<GridStatus>(STATUS.IDLE);
  const [start, setStart] = useState<NodeModel | undefined>(undefined);
  const [end, setEnd] = useState<NodeModel | undefined>(undefined);
  const [barriers, setBarriers] = useState<NodeModel[]>([]);
  const [nodes, setNodes] = useState(() => makeGrid(size, width));

  useEffect(() => {
    const handleSpacePress = (e: KeyboardEvent) => {
      if (start && end) {
        if (e.code === "space") {
          for (const row of nodes) {
            for (const n of row) {
              n.updateNeighbors(nodes);
            }
          }
        }
      }
      setStatus(STATUS.RUNNING);
    };
    window.addEventListener("keydown", handleSpacePress);

    return () => window.removeEventListener("keydown", handleSpacePress);
  }, []);

  useEffect(() => {
    if (status == STATUS.RUNNING && start && end) {
      let count = 0;
      const openSet: OpenSetItem[] = [];
      const openSetHash = new Set<NodeModel>();
      const cameFrom = new Map<string, string>();

      // setup Infinity as default values for all nodes
      const gScores = new Map<string, number>();
      const fScores = new Map<string, number>();
      for (let i = 0; i < nodes.length; i++) {
        for (let j = 0; j < nodes[i].length; j++) {
          const key = makeNodeKey(nodes[i][j]);
          gScores.set(key, Infinity);
          fScores.set(key, Infinity);
        }
      }

      const changeNodeType = (row: number, column: number, type: NodeType) => {
        setNodes((curr) => {
          // do not overwrite start and end node
          if (curr[row][column].type === "Start") return curr;
          if (curr[row][column].type === "End") return curr;
          curr[row][column].setType(type);
          return curr;
        });
      };

      // standardize adding to the queue
      const addNode = (node: NodeModel, count: number, priority: number) => {
        if (node !== start && node !== end) {
          changeNodeType(node.row, node.column, "Open");
        }
        openSetHash.add(node);
        openSet.push({ model: node, count, priority });
        openSet.sort((a, b) => {
          if (a.priority === b.priority) {
            return a.count - b.count;
          }
          return a.priority - b.priority;
        });
      };

      // setup the open set
      addNode(start, count, 0);
      // set the g score for the start node
      const startKey = makeNodeKey(start);
      gScores.set(startKey, 0);

      // estimate the distance from the start node to the end node
      const [x1, y1] = start.getPosition();
      const [x2, y2] = end.getPosition();
      fScores.set(startKey, HeuristicScore(x1, y1, x2, y2));

      while (openSet.length) {
        const current = openSet.shift()?.model;
        if (current) {
          openSetHash.delete(current);

          if (current == end) {
            // todo: make path
            let currKey = makeNodeKey(current);
            while (cameFrom.has(currKey)) {
              if (currKey) {
                changeNodeType(current.row, current.column, "Path");
                const nextKey = cameFrom.get(currKey);
                if (nextKey) {
                  const [x, y] = parseNodeKey(nextKey);
                  changeNodeType(x, y, "Path");
                  currKey = nextKey;
                }
              }
            }
            setStatus(STATUS.COMPLETE);
            break;
          }

          current.updateNeighbors(nodes);

          for (const n of current.neighbors) {
            const neighborKey = makeNodeKey(n);
            const currentKey = makeNodeKey(current);
            const tentativeScore = gScores.get(currentKey)! + 1;
            if (tentativeScore < gScores.get(neighborKey)!) {
              cameFrom.set(neighborKey, currentKey);
              gScores.set(neighborKey, tentativeScore);
              const [x1, y1] = n.getPosition();
              const [x2, y2] = end.getPosition();
              fScores.set(neighborKey, tentativeScore + HeuristicScore(x1, y1, x2, y2));
              if (!openSetHash.has(n)) {
                count++;
                addNode(n, count, fScores.get(neighborKey)!);
              }
            }
          }

          if (current !== start) {
            changeNodeType(current.row, current.column, "Closed");
          }
        }
      }
    }
    setStatus(STATUS.COMPLETE);
  }, [status]);

  return (
    <div
      id="grid"
      style={{
        boxSizing: "border-box",
        display: "block",
        width: width + size * 2,
        height: width + size * 2,
        gridTemplateRows: "auto",
        gridTemplateColumns: "auto",
        gap: "0px",
      }}
    >
      {nodes.map((row) =>
        row.map((n) => {
          const id = makeNodeKey(n);
          return (
            <GridNode
              key={id}
              model={n}
              onClick={(e) => {
                if (!start && n !== end) {
                  n.setType("Start");
                  setStart(n);
                } else if (!end && n !== start) {
                  n.setType("End");
                  setEnd(n);
                } else if (n !== start && n !== end) {
                  n.setType("Barrier");
                  setBarriers((curr) => [...curr, n]);
                }
              }}
              onContextMenu={(e) => {
                e.preventDefault();
                n.reset();
                if (n === start) {
                  setStart(undefined);
                } else if (n === end) {
                  setEnd(undefined);
                } else if (barriers.includes(n)) {
                  setBarriers((curr) => curr.filter((x) => x !== n));
                }
              }}
            />
          );
        })
      )}
    </div>
  );
};
