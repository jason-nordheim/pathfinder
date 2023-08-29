import { CSSProperties, FC, MouseEventHandler, useId, useMemo, useState } from "react";
import { NodeModel, makeGrid } from "../lib/NodeModel";
import { ValueOf } from "ts-essentials";

const STATUS = {
  IDLE: "idle",
  RUNNING: "running",
  COMPLETE: "complete",
};

type GridStatus = ValueOf<typeof STATUS>;

const GridNode: FC<{ model: NodeModel; onClick: MouseEventHandler }> = ({ model, onClick }) => {
  const style: CSSProperties = {
    position: "absolute",
    top: model.x,
    left: model.y,
    height: model.width,
    width: model.width,
    backgroundColor: model.getColor(),
    border: "1px solid gray",
  };
  return <div className="node" style={style} onClick={onClick}></div>;
};

export const Grid: FC<{ size: number; width: number }> = ({ size, width }) => {
  const [status, setStatus] = useState<GridStatus>(STATUS.IDLE);
  const [start, setStart] = useState<NodeModel | undefined>(undefined);
  const [end, setEnd] = useState<NodeModel | undefined>(undefined);
  const [barrier, setBarriers] = useState<NodeModel[]>([]);
  const nodes = useMemo(() => makeGrid(size, width), [size, width]);
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
      {nodes.map((row, r) =>
        row.map((n, c) => {
          const id = `${r}_${c}`;
          return (
            <GridNode
              key={id}
              model={n}
              onClick={(e) => {
                if (!start && n !== end) {
                  n.setStatus("Start");
                  setStart(n);
                } else if (!end && n !== start) {
                  n.setStatus("End");
                  setEnd(n);
                } else if (n !== start && n !== end) {
                  n.setStatus("Barrier");
                  setBarriers((curr) => [...curr, n]);
                }
              }}
            />
          );
        })
      )}
    </div>
  );
};
