import type { Action } from "~/src/state/constants";
import { publishDelete, publishDeleteSelected } from "../network";

export const eraseGhostShapes: Action = (data) => {
  const idsToDelete = Object.values(data.page.shapes)
    .filter((shape) => shape.isGhost)
    .map((shape) => shape.id);

  idsToDelete.forEach((id) => delete data.page.shapes[id]);

  data.pageState.selectedIds = data.pageState.selectedIds.filter(
    (id) => !idsToDelete.includes(id)
  );

  publishDelete(data, { ids: idsToDelete });

  if (
    data.pageState.hoveredId &&
    idsToDelete.includes(data.pageState.hoveredId)
  ) {
    data.pageState.hoveredId = undefined;
  }
};
