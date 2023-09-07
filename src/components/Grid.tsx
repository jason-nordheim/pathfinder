import { FC, MouseEventHandler, useEffect } from "react";
import { NodeModel, isSameCoordinates } from "../lib/NodeModel";
import { changeNode, resetNode, searchGraph, useAppDispatch, useAppSelector } from "../state";
import cx from "classnames";

const GridNode: FC<{
  model: NodeModel;
  onClick: MouseEventHandler;
  onContextMenu: MouseEventHandler;
}> = ({ model, onClick, onContextMenu }) => {
  return (
    <div
      className={cx("node", model.type.toLowerCase())}
      aria-label={`node-${model.row}-${model.column}`}
      style={{ display: "grid" }}
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
  const nodesPerRow = useAppSelector((state) => state.itemsPerRow);
  const status = useAppSelector((state) => state.status);

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
        zIndex: 1,
        boxSizing: "border-box",
        display: "grid",
        gridTemplateColumns: `repeat(${nodesPerRow}, 1fr)`,
        gridTemplateRows: `repeat(${nodesPerRow}, 1fr)`,
        aspectRatio: "1/1",
        cursor: status === "working" ? "not-allowed" : "auto",
        border: "1px solid black",
        maxWidth: "1000px",
        margin: "0 auto",
      }}
    >
      {Object.values(nodes).map((node) => {
        return (
          <GridNode
            key={node.key}
            model={node}
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
