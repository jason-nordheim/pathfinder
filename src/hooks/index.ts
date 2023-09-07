import { useEffect } from "react";

export const useResizeListener = (effect: () => void) => {
  useEffect(() => {
    window.addEventListener("resize", effect);
    return () => window.removeEventListener("reset", effect);
  }, [effect]);
};

export const useLoadListener = (effect: () => void) => {
  useEffect(() => {
    window.addEventListener("load", effect);
    return () => window.removeEventListener("load", effect);
  }, [effect]);
};

export const useMount = (effect: () => void) => {
  useEffect(() => {
    effect();
  }, [effect]);
};
