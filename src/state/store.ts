import { configureStore } from "@reduxjs/toolkit";
import { gridReducer } from "./grid.slice";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { GridState } from "./grid.common";
import { gridMiddleware } from "./grid.middleware";
import createSagaMiddleware from "redux-saga";
import { gridSaga } from "./grid.saga";

// const sagaMiddleware = createSagaMiddleware();

const store = configureStore({
  reducer: gridReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(gridMiddleware.middleware),
});

// sagaMiddleware.run(gridSaga);

const useAppSelector: TypedUseSelectorHook<GridState> = useSelector;

const useAppDispatch: () => typeof store.dispatch = useDispatch;

export { store, useAppDispatch, useAppSelector };
