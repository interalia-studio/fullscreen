import { Shape, shapeUtils } from "~/src/shapes";
import type { Action } from "~/src/state/constants";

export const updateShapes: Action = (data, { shapes }) => {
  try {
    shapes.forEach((partial, i) => {
      if (Object.keys(shapeUtils).includes(partial.type)) {
        Object.assign(data.page.shapes[partial.id], partial);
      } else {
        console.warn("Ignoring shape type", partial.type);
      }
    });
  } catch (e: any) {
    e.message = "Could not update shapes: " + e.message;
    console.error(e);
  }
};
