import { CSSProperties, FC, MouseEventHandler, useEffect } from "react";
import { NODE_COLOR_MAP, NodeModel, isSameCoordinates, makeNodeKey } from "../lib/NodeModel";
import { changeNode, initializeGraph, resetNode, useAppDispatch, useAppSelector } from "../state";

const GridNode: FC<{
  model: NodeModel;
  onClick: MouseEventHandler;
  onContextMenu: MouseEventHandler;
  size: number;
}> = ({ model, onClick, onContextMenu, size }) => {
  const style: CSSProperties = {
    position: "absolute",
    top: model.x,
    left: model.y,
    height: size,
    width: size,
    backgroundColor: NODE_COLOR_MAP[model.type],
    border: "1px solid gray",
    transition: "all",
  };
  return (
    <div
      className="node"
      aria-label={`node-${model.x}-${model.y}`}
      style={style}
      onClick={onClick}
      onContextMenu={onContextMenu}
    ></div>
  );
};

export const Grid = () => {
  const dispatch = useAppDispatch();
  const end = useAppSelector((state) => state.grid.grid.end);
  const start = useAppSelector((state) => state.grid.grid.start);
  const nodes = useAppSelector((state) => state.grid.grid.nodes);
  const size = useAppSelector((state) => state.grid.grid.size);
  const nodesPerRow = useAppSelector((state) => state.grid.grid.itemsPerRow);
  const nodeSize = Math.floor(size / nodesPerRow);

  const handleNodeSelect = (node: NodeModel) => {
    const isStart = start && isSameCoordinates(node, start);
    const isEnd = end && isSameCoordinates(node, end);
    if (!start) {
      //node.setType('Start')
      dispatch(changeNode({ row: node.row, column: node.column, changes: { type: "Start" } }));
    } else if (!end && !isStart) {
      //node.setType('End')
      dispatch(changeNode({ row: node.row, column: node.column, changes: { type: "End" } }));
    } else if (!isStart && !isEnd) {
      //node.setType('End')
      dispatch(changeNode({ row: node.row, column: node.column, changes: { type: "Barrier" } }));
    }
  };

  const handleNodeDeSelect = (node: NodeModel) => {
    // node.reset();
    dispatch(resetNode(node));
  };

  console.log({ columnSize: nodes.length, size });

  return (
    <div
      id="grid"
      style={{
        position: "relative",
        boxSizing: "border-box",
        display: "block",
        width: size,
        height: size,
        gridTemplateRows: "auto",
        gridTemplateColumns: "auto",
        transition: "all",
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
              size={nodeSize}
              onClick={() => handleNodeSelect(n)}
              onContextMenu={(e) => {
                e.preventDefault();
                handleNodeDeSelect(n);
              }}
            />
          );
        })
      )}
    </div>
  );
};
