import { TLBoundsCorner, TLPointerInfo } from "@tldraw/core";
import { shapeUtils } from "~/src/shapes";
import type { Action } from "~/src/state/constants";
import { getPagePoint } from "~/src/state/helpers";
import { mutables } from "~/src/state/mutables";

export const createBoxShape: Action = (data, payload: TLPointerInfo) => {
  const shape = shapeUtils.box.getShape({
    parentId: "page1",
    point: mutables.currentPoint,
    size: [1, 1],
    childIndex: Object.values(data.page.shapes).length,
  });

  data.page.shapes[shape.id] = shape;
  data.pageState.selectedIds = [shape.id];

  mutables.pointedBoundsHandleId = TLBoundsCorner.BottomRight;
};
