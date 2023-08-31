import { FC } from "react";
import { NODE_COLORS } from "../lib/NodeModel";
import { useAppSelector } from "../state";

const LEGEND_ITEM_STYLES: React.CSSProperties = {
  boxSizing: "border-box",
  display: "flex",
  gap: "0.5em",
  justifyContent: "space-between",
};

export const Legend: FC = () => {
  const itemsPerRow = useAppSelector((state) => state.grid.nodes.length);
  const widthOfGrid = useAppSelector((state) => state.grid.size);
  const gridItemSize = Math.floor(widthOfGrid / itemsPerRow);

  return (
    <div
      id="grid-legend"
      style={{
        display: "flex",
        alignItems: "center",
        gap: "1em",
        flexDirection: "column",
        fontSize: "0.95em",
        fontFamily: "sans-serif",
        fontWeight: "lighter",
      }}
    >
      <h3>Legend</h3>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <span style={LEGEND_ITEM_STYLES}>
          <span>Closed</span>
          <span
            id="legend-red"
            style={{
              boxSizing: "border-box",
              width: gridItemSize,
              height: gridItemSize,
              backgroundColor: NODE_COLORS.RED,
            }}
          />
        </span>
        <span style={LEGEND_ITEM_STYLES}>
          <span>Open</span>
          <span
            id="legend-red"
            style={{
              boxSizing: "border-box",
              width: gridItemSize,
              height: gridItemSize,
              backgroundColor: NODE_COLORS.GREEN,
            }}
          />
        </span>
        <span style={LEGEND_ITEM_STYLES}>
          <span>Barrier</span>
          <span
            id="legend-red"
            style={{
              boxSizing: "border-box",
              width: gridItemSize,
              height: gridItemSize,
              backgroundColor: NODE_COLORS.BLACK,
            }}
          />
        </span>
        <span style={LEGEND_ITEM_STYLES}>
          <span>Start</span>
          <span
            id="legend-red"
            style={{
              boxSizing: "border-box",
              width: gridItemSize,
              height: gridItemSize,
              backgroundColor: NODE_COLORS.ORANGE,
            }}
          />
        </span>
        <span style={LEGEND_ITEM_STYLES}>
          <span>End</span>
          <span
            id="legend-red"
            style={{
              boxSizing: "border-box",
              width: gridItemSize,
              height: gridItemSize,
              backgroundColor: NODE_COLORS.TURQUOISE,
            }}
          />
        </span>
        <span style={LEGEND_ITEM_STYLES}>
          <span>Path</span>
          <span
            id="legend-red"
            style={{
              boxSizing: "border-box",
              width: gridItemSize,
              height: gridItemSize,
              backgroundColor: NODE_COLORS.PURPLE,
            }}
          />
        </span>
      </div>
    </div>
  );
};
