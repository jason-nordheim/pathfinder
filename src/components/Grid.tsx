import { CSSProperties, FC, MouseEventHandler, useEffect, useMemo, useState } from "react";
import { HeuristicScore, NodeModel, NodeType, makeGrid, makeNodeKey, parseNodeKey } from "../lib/NodeModel";
import { ValueOf } from "ts-essentials";
import { Vertex, VertexType, makeVertexKey, useVertices } from "../hooks/useVertices";

const COLORS = {
  WHITE: "#FFF",
  RED: "#FF0000",
  ORANGE: "#FFA500",
  GREEN: "#008000",
  PURPLE: "#DA70D6",
  TURQUOISE: "#40E0D0",
  BLACK: "#000",
};

const COLOR_MAP: { [k in VertexType]: string } = {
  Unknown: COLORS.WHITE,
  Start: COLORS.ORANGE,
  End: COLORS.TURQUOISE,
  Path: COLORS.PURPLE,
  Closed: COLORS.RED,
  Barrier: COLORS.BLACK,
  Open: COLORS.GREEN,
};

const GridNode: FC<{
  x: number;
  y: number;
  size: number;
  type: VertexType;
  onClick: MouseEventHandler;
  onContextMenu?: MouseEventHandler;
}> = ({ x, y, size, type, onClick, onContextMenu }) => {
  const style: CSSProperties = {
    position: "absolute",
    top: x,
    left: y,
    height: size,
    width: size,
    backgroundColor: COLOR_MAP[type],
    border: "1px solid gray",
  };
  return <div className="node" style={style} onClick={onClick} onContextMenu={onContextMenu}></div>;
};

export const Grid: FC<{ size: number; width: number }> = ({ size, width }) => {
  const { graph, status, vertexSize, start, end, changeNodeType, findShortestPath } = useVertices(size, width);
  const [vertexType, setVertexType] = useState<VertexType>("Start");

  const handleVertexClick = (vertex: Vertex) => {
    console.log("hi");
    if (status !== "working") {
      if (!start) {
        changeNodeType(vertexType, { row: vertex.row, column: vertex.column });
        setVertexType("End");
      } else if (!end) {
        changeNodeType(vertexType, { row: vertex.row, column: vertex.column });
        setVertexType("Barrier");
      } else {
        changeNodeType(vertexType, { row: vertex.row, column: vertex.column });
      }
    }
  };

  return (
    <div
      id="grid"
      style={{
        position: "relative",
        boxSizing: "border-box",
        display: "block",
        width: width + size * 2,
        height: width + size * 2,
        gridTemplateRows: "auto",
        gridTemplateColumns: "auto",
        gap: "0px",
      }}
    >
      {graph.map((row) =>
        row.map((vertex) => {
          const id = makeVertexKey(vertex.row, vertex.column);
          return (
            <GridNode
              key={id}
              x={vertex.x}
              y={vertex.y}
              size={vertexSize}
              type={vertex.type!}
              onClick={() => handleVertexClick(vertex)}
            />
          );
        })
      )}
    </div>
  );
};
