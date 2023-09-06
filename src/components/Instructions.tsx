export const Instructions = () => {
  return (
    <div id="instructions">
      <h4>Instructions</h4>
      <ul>
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
  );
};
