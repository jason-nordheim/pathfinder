import { Controls } from "./components/Controls";
import { Grid } from "./components/Grid";
import { Instructions } from "./components/Instructions";
import { Legend } from "./components/Legend";
import "./App.css";
import { DEFAULT_NODES_PER_ROW, initializeGraph, useAppDispatch, useAppSelector } from "./state";
import { useLoadListener, useMount, useResizeListener } from "./hooks";
import { useState } from "react";
import { WIDTH_THRESHOLDS } from "./common";

const Styles: { [k: number]: React.CSSProperties } = {
  [WIDTH_THRESHOLDS.LG]: {
    display: "grid",
    gridTemplateColumns: "50% 20% 30%",
    maxWidth: "1000px",
    margin: "0 auto",
  },
  [WIDTH_THRESHOLDS.MD]: {
    display: "gird",
    gridAutoColumns: "auto",
  },
};

function App() {
  const [widthThreshold, setWidthThreshold] = useState(800);
  const nodesPerRow = useAppSelector((state) => state.itemsPerRow);
  const dispatch = useAppDispatch();

  const handleResize = () => {
    const width = window.innerWidth;
    if (width >= WIDTH_THRESHOLDS.LG && nodesPerRow != DEFAULT_NODES_PER_ROW) {
      setWidthThreshold(WIDTH_THRESHOLDS.LG);
      dispatch(initializeGraph({ numPerRow: DEFAULT_NODES_PER_ROW }));
    } else if (width < WIDTH_THRESHOLDS.LG && width > WIDTH_THRESHOLDS.MD && nodesPerRow != 20) {
      setWidthThreshold(WIDTH_THRESHOLDS.MD);
      dispatch(initializeGraph({ numPerRow: 20 }));
    }
    console.log({ windowWidth: width });
  };

  useLoadListener(handleResize);
  useResizeListener(handleResize);
  useMount(handleResize);

  return (
    <div id="app">
      <div className="app-title-container">
        <h1>Pathfinder</h1>
      </div>
      <div id="app-content">
        <aside style={Styles[widthThreshold]}>
          <Instructions />
          <Legend />
          <Controls threshold={widthThreshold} />
        </aside>
        <Grid />
        <aside></aside>
      </div>
    </div>
  );
}

export default App;
