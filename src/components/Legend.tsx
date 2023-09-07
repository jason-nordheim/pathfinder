import { FC } from "react";

export const Legend: FC = () => {
  return (
    <div id="grid-legend">
      <h3>Legend</h3>
      <div style={{ display: "grid", gridTemplateRows: "repeat(6, 1fr)" }}>
        <span className="legend-item">
          <span>Closed</span>
          <span id="legend-closed" className={"closed"} />
        </span>
        <span className="legend-item">
          <span>Open</span>
          <span id="legend-open" className="open" />
        </span>
        <span className="legend-item">
          <span>Barrier</span>
          <span id="legend-barrier" className="barrier" />
        </span>
        <span className="legend-item">
          <span>Start</span>
          <span id="legend-start" className="start" />
        </span>
        <span className="legend-item">
          <span>End</span>
          <span id="legend-end" className="end" />
        </span>
        <span className="legend-item">
          <span>Path</span>
          <span id="legend-path" className="path" />
        </span>
      </div>
    </div>
  );
};
