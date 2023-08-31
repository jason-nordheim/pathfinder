import { configureStore } from "@reduxjs/toolkit";
import { gridSlice } from "./grid.slice";
import { gridMiddleware } from "./grid.middleware";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { GridState } from ".";

const store = configureStore({
  reducer: { [gridSlice.name]: gridSlice.reducer },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(gridMiddleware.middleware),
});

const useAppSelector: TypedUseSelectorHook<{ grid: GridState }> = useSelector;

const useAppDispatch: () => typeof store.dispatch = useDispatch;

export { store, useAppDispatch, useAppSelector };
