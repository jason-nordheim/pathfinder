import { configureStore } from "@reduxjs/toolkit";
import { gridReducer, gridSlice } from "./grid.slice";
import { gridMiddleware } from "./grid.middleware";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { GridState } from ".";

const store = configureStore({
  reducer: gridReducer,
  // middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(gridMiddleware.middleware),
});

const useAppSelector: TypedUseSelectorHook<GridState> = useSelector;

const useAppDispatch: () => typeof store.dispatch = useDispatch;

export { store, useAppDispatch, useAppSelector };
