import { FC } from "react";
import { useAppSelector } from "../state";

export const Legend: FC = () => {
  const itemsPerRow = useAppSelector((state) => state.itemsPerRow);
  const widthOfGrid = useAppSelector((state) => state.size);
  const gridItemSize = Math.floor(widthOfGrid / itemsPerRow);

  return (
    <div id="grid-legend">
      <h3>Legend</h3>
      <div>
        <span className="legend-item">
          <span>Closed</span>
          <span
            id="legend-closed"
            className={"closed"}
            style={{
              width: gridItemSize,
              height: gridItemSize,
            }}
          />
        </span>
        <span className="legend-item">
          <span>Open</span>
          <span
            id="legend-open"
            className="open"
            style={{
              width: gridItemSize,
              height: gridItemSize,
            }}
          />
        </span>
        <span className="legend-item">
          <span>Barrier</span>
          <span
            id="legend-barrier"
            className="barrier"
            style={{
              width: gridItemSize,
              height: gridItemSize,
            }}
          />
        </span>
        <span className="legend-item">
          <span>Start</span>
          <span
            id="legend-start"
            className="start"
            style={{
              width: gridItemSize,
              height: gridItemSize,
            }}
          />
        </span>
        <span className="legend-item">
          <span>End</span>
          <span
            id="legend-end"
            className="end"
            style={{
              width: gridItemSize,
              height: gridItemSize,
            }}
          />
        </span>
        <span className="legend-item">
          <span>Path</span>
          <span
            id="legend-path"
            className="path"
            style={{
              width: gridItemSize,
              height: gridItemSize,
            }}
          />
        </span>
      </div>
    </div>
  );
};
