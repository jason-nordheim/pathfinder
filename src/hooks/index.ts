import { useEffect, useMemo } from "react";

export const useDynamicNodeSize = (gridWidth: number, nodesPerRow: number) => {
  const nodeSize = useMemo(() => Math.floor(gridWidth / nodesPerRow) - 2, [gridWidth, nodesPerRow]);
  return nodeSize;
};

export const useResizeListener = ({ onResize }: { onResize: () => void }) => {
  useEffect(() => {
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("reset", onResize);
  }, [onResize]);
};
