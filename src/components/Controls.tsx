import { useAppSelector } from "../state";

export const Controls = () => {
  const start = useAppSelector((state) => state.start);
  const end = useAppSelector((state) => state.end);
  return (
    <div
      id="controls"
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        margin: "1em",
        fontFamily: "sans-serif",
      }}
    >
      <h3 style={{ textAlign: "center" }}>Controls</h3>
      <button disabled={Boolean(!start || !end)}>Reset</button>
    </div>
  );
};
