import { FC, MouseEventHandler, useEffect, useMemo } from "react";
import { NodeModel, isSameCoordinates } from "../lib/NodeModel";
import { changeNode, resetNode, searchGraph, useAppDispatch, useAppSelector } from "../state";
import cx from "classnames";
import { useDynamicNodeSize } from "../hooks";

const GridNode: FC<{
  model: NodeModel;
  onClick: MouseEventHandler;
  onContextMenu: MouseEventHandler;
  size: number;
}> = ({ model, onClick, onContextMenu, size }) => {
  return (
    <div
      className={cx("node", model.type.toLowerCase())}
      aria-label={`node-${model.x}-${model.y}`}
      style={{
        top: model.x,
        left: model.y,
        height: size,
        width: size,
      }}
      onClick={onClick}
      onContextMenu={onContextMenu}
    ></div>
  );
};

export const Grid = () => {
  const dispatch = useAppDispatch();
  const end = useAppSelector((state) => state.end);
  const start = useAppSelector((state) => state.start);
  const nodes = useAppSelector((state) => state.nodes);
  const size = useAppSelector((state) => state.size);
  const nodesPerRow = useAppSelector((state) => state.itemsPerRow);
  const status = useAppSelector((state) => state.status);
  const nodeSize = useDynamicNodeSize(size, nodesPerRow);
  const gridSize = useMemo(() => size - nodesPerRow * 0.7, [size, nodesPerRow]);

  useEffect(() => {
    const findShortestPath = (e: KeyboardEvent) => {
      if (e.key === " " && status !== "working") {
        dispatch(searchGraph());
      }
    };
    window.addEventListener("keypress", findShortestPath);
    return () => window.removeEventListener("keypress", findShortestPath);
  }, [dispatch, status]);

  const handleNodeSelect = (node: NodeModel) => {
    if (node.key && status !== "working") {
      const isStart = start && isSameCoordinates(node, start);
      const isEnd = end && isSameCoordinates(node, end);
      if (start === undefined) {
        dispatch(changeNode({ key: node.key, changes: { type: "Start" } }));
      } else if (end == undefined && !isStart && !isEnd) {
        dispatch(changeNode({ key: node.key, changes: { type: "End" } }));
      } else if (!isStart && !isEnd) {
        dispatch(changeNode({ key: node.key, changes: { type: "Barrier" } }));
      }
    }
  };

  const handleNodeDeSelect = (node: NodeModel) => {
    if (node.key && status !== "working") {
      dispatch(resetNode(node.key));
    }
  };

  return (
    <div
      id="grid"
      style={{
        width: gridSize,
        height: gridSize,
        cursor: status === "working" ? "not-allowed" : "auto",
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
