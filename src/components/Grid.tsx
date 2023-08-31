import { CSSProperties, FC, MouseEventHandler } from "react";
import { NODE_COLOR_MAP, NodeModel, isSameCoordinates } from "../lib/NodeModel";
import { changeNode, resetNode, useAppDispatch, useAppSelector } from "../state";

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
  const end = useAppSelector((state) => state.grid.end);
  const start = useAppSelector((state) => state.grid.start);
  const nodes = useAppSelector((state) => state.grid.nodes);
  const size = useAppSelector((state) => state.grid.size);
  const nodesPerRow = useAppSelector((state) => state.grid.itemsPerRow);
  const nodeSize = Math.floor(size / nodesPerRow);

  const handleNodeSelect = (node: NodeModel) => {
    const isStart = start && isSameCoordinates(node, start);
    const isEnd = end && isSameCoordinates(node, end);
    if (!start) {
      //node.setType('Start')
      console.log("setting start");
      dispatch(changeNode({ key: node.key, changes: { type: "Start" } }));
    } else if (!end && !isStart) {
      //node.setType('End')
      dispatch(changeNode({ key: node.key, changes: { type: "End" } }));
    } else if (!isStart && !isEnd) {
      //node.setType('End')
      dispatch(changeNode({ key: node.key, changes: { type: "Barrier" } }));
    }
  };

  const handleNodeDeSelect = (node: NodeModel) => {
    // node.reset();
    dispatch(resetNode(node.key));
  };

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
      {Object.values(nodes).map((node) => {
        return (
          <GridNode
            key={node.key}
            model={node}
            size={nodeSize}
            onClick={() => handleNodeSelect(node)}
            onContextMenu={(e) => {
              e.preventDefault();
              handleNodeDeSelect(node);
            }}
          />
        );
      })}
    </div>
  );
};
