import { Grid } from "./components/Grid";
import { Legend } from "./components/Legend";
import { DEFAULT_GRID_WIDTH, useAppSelector } from "./state";

function App() {
  const size = useAppSelector((state) => state.size);
  return (
    <div id="app" style={{ display: "flex", flexDirection: "column" }}>
      <div style={{ textAlign: "center", fontFamily: "sans-serif" }}>
        <h1>Pathfinder</h1>
      </div>
      <div id="grid-container" style={{ display: "flex", justifyContent: "center", padding: "1em" }}>
        <aside style={{ width: DEFAULT_GRID_WIDTH / 2, marginRight: "2em" }}>
          <div id="instructions">
            <h4 style={{ textAlign: "center", fontFamily: "sans-serif" }}>Instructions</h4>
            <ul style={{ fontFamily: "sans-serif", fontWeight: "lighter", fontSize: "0.95em" }}>
              <li>Use the left mouse button to add nodes to the grid.</li>
              <li>The first click will add the start node.</li>
              <li>The second click will add the end node.</li>
              <li>Any subsequent clicks will add barriers.</li>
              <li>
                Once satisfied with the placement of the start/end nodes and any barriers, press the space bar to start
                running the algorithm for finding the shortest path
              </li>
            </ul>
          </div>
          <div style={{ backgroundColor: "white", padding: "1em", fontFamily: "sans-serif" }}>
            <label htmlFor="grid-size">Grid Size: </label>
            <input
              disabled
              type="number"
              name="grid-size"
              id="grid-size"
              value={size}
              style={{ fontFamily: "sans-serif" }}
            />
          </div>
        </aside>
        <Grid />
        <aside style={{ minWidth: "250px" }}>
          <Legend />
        </aside>
      </div>
    </div>
  );
}

export default App;
