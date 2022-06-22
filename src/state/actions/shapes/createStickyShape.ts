import { TLBoundsCorner, TLPointerInfo } from "@tldraw/core";
import { shapeUtils } from "~/src/shapes";
import type { Action } from "~/src/state/constants";
import { mutables } from "~/src/state/mutables";

export const createStickyShape: Action = (data, payload: TLPointerInfo) => {
  const shape = shapeUtils.sticky.getShape({
    parentId: "page1",
    point: mutables.currentPoint,
    childIndex: Object.values(data.page.shapes).length,
  });

  data.page.shapes[shape.id] = shape;
  data.pageState.selectedIds = [shape.id];

  mutables.pointedShapeId = shape.id;
};
