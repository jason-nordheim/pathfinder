import { createAction } from "@reduxjs/toolkit";
import { NodePosition } from "../lib/NodeModel";
import { ChangeNodeParams, GridGraph, GridStatus, InitializeGridParams } from "./grid.common";

export const searchGraph = createAction("graph/search");
export const replaceNodes = createAction<GridGraph>("graph/replaceNodes");
export const resetNode = createAction<string>("graph/resetNode");
export const initializeGraph = createAction<InitializeGridParams>("graph/init");
export const changeNode = createAction<ChangeNodeParams>("grid/changeNode");
export const setStatus = createAction<GridStatus>("grid/setStatus");
export const setBarriers = createAction<NodePosition[]>("grid/setBarriers");
