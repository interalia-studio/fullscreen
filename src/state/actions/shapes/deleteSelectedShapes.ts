import store from "~/src/adapters/yjs/store";
import type { Action } from "~/src/state/constants";

export const deleteSelectedShapes: Action = (data) => {
  const { page, pageState } = data;
  if (
    pageState.hoveredId &&
    pageState.selectedIds.includes(pageState.hoveredId)
  ) {
    pageState.hoveredId = undefined;
  }
  pageState.selectedIds.forEach((id) => delete page.shapes[id]);
  store.deleteShapes(pageState.selectedIds);
  pageState.selectedIds = [];
};
