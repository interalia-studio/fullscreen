import { nanoid } from "nanoid";
import { getShapeUtils, Shape, shapeUtils } from "~/src/shapes";
import type { Action } from "~/src/state/constants";

export const createShapes: Action = (
  data,
  payload: { shapes: (Partial<Shape> & Pick<Shape, "type">)[] }
) => {
  try {
    payload.shapes.forEach((partial, i) => {
      if (Object.keys(shapeUtils).includes(partial.type)) {
        const shape = getShapeUtils(partial.type).getShape({
          id: nanoid(),
          childIndex: Object.values(data.page.shapes).length,
          ...partial,
          parentId: "page1",
        });

        data.page.shapes[shape.id] = shape;
      } else {
        console.warn("Ignoring shape type", partial.type);
      }
    });
  } catch (e: any) {
    e.message = "Could not create shapes: " + e.message;
    console.error(e);
  }
};
