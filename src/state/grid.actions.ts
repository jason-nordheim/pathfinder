import { createAction } from "@reduxjs/toolkit";
import { NodeModel } from "../lib/NodeModel";
import { ChangeNodeParams, GridStatus, InitializeGridParams } from "./grid.common";

export const searchGraph = createAction("graph/search");
export const replaceNodes = createAction<NodeModel[][]>("graph/replaceNodes");
export const initializeGraph = createAction<InitializeGridParams>("graph/init");
export const changeNode = createAction<ChangeNodeParams>("grid/changeNode");
export const setStatus = createAction<GridStatus>("grid/setStatus");
