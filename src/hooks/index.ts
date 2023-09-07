import { useEffect, useMemo } from "react";

export const useDynamicNodeSize = (gridWidth: number, nodesPerRow: number) => {
  const nodeSize = useMemo(() => Math.floor(gridWidth / nodesPerRow) - 2, [gridWidth, nodesPerRow]);
  return nodeSize;
};

export const useResizeListener = (effect: () => void) => {
  useEffect(() => {
    window.addEventListener("resize", effect);
    return () => window.removeEventListener("reset", effect);
  }, [effect]);
};

export const useLoadListener = (effect: () => void) => {
  useEffect(() => {
    window.addEventListener("DOMContentLoaded", effect);
    return () => window.removeEventListener("DOMContentLoaded", effect);
  }, [effect]);
};
