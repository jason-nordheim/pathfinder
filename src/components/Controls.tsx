import { searchGraph, useAppDispatch, useAppSelector } from "../state";

const NumberOfNodes = () => {
  const itemsPerRow = useAppSelector((state) => state.itemsPerRow);
  return (
    <div style={{ backgroundColor: "white", padding: "1em", fontFamily: "sans-serif" }}>
      <label htmlFor="grid-size">Grid Size: </label>
      <input
        disabled
        type="number"
        name="grid-size"
        id="grid-size"
        value={itemsPerRow}
        style={{ fontFamily: "sans-serif" }}
      />
    </div>
  );
};

export const Controls = () => {
  const dispatch = useAppDispatch();
  const start = useAppSelector((state) => state.start);
  const end = useAppSelector((state) => state.end);
  const status = useAppSelector((state) => state.status);

  const handleRun = () => {
    dispatch(searchGraph());
  };

  return (
    <div
      id="controls"
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: "5px",
        margin: "1em",
        fontFamily: "sans-serif",
      }}
    >
      <h4 style={{ textAlign: "center" }}>Controls</h4>
      <button
        disabled={(!start && !end) || status == "working"}
        onClick={handleRun}
        aria-label="find the shortest path"
      >
        Find shortest path
      </button>
    </div>
  );
};
