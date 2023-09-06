import { searchGraph, useAppDispatch, useAppSelector } from "../state";

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
      <h3 style={{ textAlign: "center" }}>Controls</h3>
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
