import type { Action } from "~/src/state/constants";

export const clearHoveredShape: Action = (data) => {
  data.pageState.hoveredId = undefined;
};
