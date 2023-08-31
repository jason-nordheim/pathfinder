import { configureStore } from "@reduxjs/toolkit";
import { gridSlice } from "./grid.slice";
import { gridMiddleware } from "./grid.middleware";

const store = configureStore({
  reducer: { grid: gridSlice.reducer },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(gridMiddleware.middleware),
});

export { store };
