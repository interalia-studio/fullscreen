import type { Action } from "~/src/state/constants";

export const deselectAllShapes: Action = (data) => {
  data.pageState.selectedIds = [];
};
