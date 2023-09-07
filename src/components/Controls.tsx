import { FC } from "react";
import { initializeGraph, searchGraph, useAppDispatch, useAppSelector } from "../state";
import { WIDTH_THRESHOLDS } from "../common";

// const NumberOfNodes = () => {
//   const itemsPerRow = useAppSelector((state) => state.itemsPerRow);
//   return (
//     <div style={{ backgroundColor: "white", padding: "1em", fontFamily: "sans-serif" }}>
//       <label htmlFor="grid-size">Grid Size: </label>
//       <input
//         disabled
//         type="number"
//         name="grid-size"
//         id="grid-size"
//         value={itemsPerRow}
//         style={{ fontFamily: "sans-serif" }}
//       />
//     </div>
//   );
// };

const Styles: { [k: number]: React.CSSProperties } = {
  [WIDTH_THRESHOLDS.LG]: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    gap: "5px",
    margin: "1em",
  },
  [WIDTH_THRESHOLDS.MD]: {
    columnSpan: "all",
  },
};

export const Controls: FC<{ threshold: number }> = ({ threshold }) => {
  const dispatch = useAppDispatch();
  const start = useAppSelector((state) => state.start);
  const end = useAppSelector((state) => state.end);
  const status = useAppSelector((state) => state.status);
  const nodesPerRow = useAppSelector((state) => state.itemsPerRow);

  const handleRun = () => {
    dispatch(searchGraph());
  };

  const handleReset = () => {
    dispatch(initializeGraph({ numPerRow: nodesPerRow }));
  };

  return (
    <div id="controls" style={Styles[threshold]}>
      <h4 style={{ textAlign: "center" }}>Controls</h4>
      <button
        disabled={(!start && !end) || status == "working"}
        onClick={handleRun}
        aria-label="find the shortest path"
      >
        Find Path
      </button>
      <button
        disabled={(!start && !end) || status == "working"}
        onClick={handleReset}
        aria-label="find the shortest path"
      >
        Reset
      </button>
    </div>
  );
};
