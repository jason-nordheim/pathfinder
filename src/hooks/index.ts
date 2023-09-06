import { useMemo } from "react";

export const useDynamicNodeSize = (gridWidth: number, nodesPerRow: number) => {
  const nodeSize = useMemo(() => Math.floor(gridWidth / nodesPerRow) - 2, [gridWidth, nodesPerRow]);
  return nodeSize;
};
