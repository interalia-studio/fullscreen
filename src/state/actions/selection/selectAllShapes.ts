import type { Action } from "~/src/state/constants";

export const selectAllShapes: Action = (data) => {
  data.pageState.selectedIds = Object.keys(data.page.shapes);
};
