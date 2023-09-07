import { Controls } from "./components/Controls";
import { Grid } from "./components/Grid";
import { Instructions } from "./components/Instructions";
import { Legend } from "./components/Legend";
import "./App.css";
import { DEFAULT_NODES_PER_ROW, initializeGraph, useAppDispatch, useAppSelector } from "./state";
import { useResizeListener } from "./hooks";

function App() {
  const nodesPerRow = useAppSelector((state) => state.itemsPerRow);
  const dispatch = useAppDispatch();

  const handleResize = () => {
    const windowWidth = window.innerWidth;
    if (windowWidth > 800 && nodesPerRow != DEFAULT_NODES_PER_ROW) {
      dispatch(initializeGraph({ numPerRow: DEFAULT_NODES_PER_ROW }));
    }
    console.log({ windowWidth });
  };

  useResizeListener({ onResize: handleResize });

  return (
    <div id="app">
      <div className="app-title-container">
        <h1>Pathfinder</h1>
      </div>
      <div id="app-content">
        <aside style={{ display: "inline-grid", gridTemplateColumns: "repeat(2, 1fr)" }}>
          <Instructions />
          <Legend />
        </aside>
        <Grid />
        <aside>
          <Controls />
        </aside>
      </div>
    </div>
  );
}

export default App;
