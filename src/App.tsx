import { Controls } from "./components/Controls";
import { Grid } from "./components/Grid";
import { Instructions } from "./components/Instructions";
import { Legend } from "./components/Legend";
import "./App.css";

function App() {
  return (
    <div id="app">
      <div className="app-title-container">
        <h1>Pathfinder</h1>
      </div>
      <div id="app-content">
        <aside>
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
