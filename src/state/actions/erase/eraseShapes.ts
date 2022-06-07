import type { TLPointerInfo } from "@tldraw/core";
import type { Action } from "~/src/state/constants";
import { getPagePoint } from "~/src/state/helpers";
import { getShapeUtils } from "~/src/shapes";
import { mutables } from "~/src/state/mutables";

export const eraseShapes: Action = (data, payload: TLPointerInfo) => {
  const { previousPoint } = mutables;

  Object.values(data.page.shapes)
    .filter((shape) => !shape.isGhost)
    .forEach((shape) => {
      if (
        getShapeUtils(shape).hitTestLineSegment(
          shape,
          previousPoint,
          mutables.currentPoint
        )
      ) {
        shape.isGhost = true;
      }
    });
};
