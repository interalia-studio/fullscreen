import type { TLPointerInfo } from "@tldraw/core";
import type { Action } from "~/src/state/constants";
import { shapeUtils } from "~/src/shapes";
import { getPagePoint } from "~/src/state/helpers";
import { mutables } from "~/src/state/mutables";

export const createPencilShape: Action = (data, payload: TLPointerInfo) => {
  const shape = shapeUtils.pencil.getShape({
    parentId: "page1",
    point: mutables.currentPoint,
    points: [[0, 0]],
    childIndex: Object.values(data.page.shapes).length,
  });

  data.page.shapes[shape.id] = shape;
  data.pageState.selectedIds = [shape.id];

  mutables.rawPoints = [[0, 0]];
  mutables.pointedShapeId = shape.id;
};
