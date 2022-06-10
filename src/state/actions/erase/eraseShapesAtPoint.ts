import type { Action } from "~/src/state/constants";
import { getShapeUtils } from "~/src/shapes";
import { mutables } from "~/src/state/mutables";
import { publishDelete } from "../network";

export const eraseShapesAtPoint: Action = (data) => {
  const { currentPoint } = mutables;

  const idsToDelete = [];
  Object.values(data.page.shapes).forEach((shape) => {
    if (getShapeUtils(shape).hitTestPoint(shape, currentPoint)) {
      idsToDelete.push(shape.id);
      delete data.page.shapes[shape.id];
    }
  });

  publishDelete(data, { ids: idsToDelete });

  const { shapes } = data.page;
  const { selectedIds, hoveredId } = data.pageState;

  // Filter out any deleted shapes
  data.pageState.selectedIds = selectedIds.filter((id) => {
    return shapes[id] !== undefined;
  });

  // Remove hovered id if it's been deleted
  if (hoveredId && !shapes[hoveredId]) {
    data.pageState.hoveredId = undefined;
  }
};
