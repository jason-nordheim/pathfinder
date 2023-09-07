import { Controls } from "./components/Controls";
import { Grid } from "./components/Grid";
import { Instructions } from "./components/Instructions";
import { Legend } from "./components/Legend";
import "./App.css";
import { DEFAULT_NODES_PER_ROW, initializeGraph, useAppDispatch, useAppSelector } from "./state";
import { useLoadListener, useResizeListener } from "./hooks";
import { useState } from "react";

const Styles: { [k: number]: React.CSSProperties } = {
  [800]: {
    display: "grid",
    gridTemplateColumns: "50% 20% 30%",
    maxWidth: "1000px",
    margin: "0 auto",
  },
  [500]: {
    display: "gird",
    gridTemplateColumns: "60% 40%",
    gridTemplateRows: "repeat(1, auto)",
  },
};

function App() {
  const [widthThreshold, setWidthThreshold] = useState(800);
  const nodesPerRow = useAppSelector((state) => state.itemsPerRow);
  const dispatch = useAppDispatch();

  const handleResize = () => {
    const width = window.innerWidth;
    if (width >= 800 && nodesPerRow != DEFAULT_NODES_PER_ROW) {
      setWidthThreshold(800);
      dispatch(initializeGraph({ numPerRow: DEFAULT_NODES_PER_ROW }));
    } else if (width < 800 && width > 500) {
      setWidthThreshold(500);
      dispatch(initializeGraph({ numPerRow: 20 }));
    }
    console.log({ windowWidth: width });
  };

  useResizeListener(handleResize);
  useLoadListener(handleResize);

  return (
    <div id="app">
      <div className="app-title-container">
        <h1>Pathfinder</h1>
      </div>
      <div id="app-content">
        <aside style={Styles[widthThreshold]}>
          <Instructions />
          <Legend />
          <Controls />
        </aside>
        <Grid />
        <aside></aside>
      </div>
    </div>
  );
}

export default App;
