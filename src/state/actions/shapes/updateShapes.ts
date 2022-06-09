import type { Shape } from "shapes";
import type { Action } from "~/src/state/constants";

export const updateShapes: Action = (
  data,
  payload: (Partial<Shape> & Pick<Shape, "id">)[]
) => {
  try {
    payload.forEach((partial, i) => {
      Object.assign(data.page.shapes[partial.id], { ...partial });
    });
  } catch (e: any) {
    console.log({ ...payload });
    e.message = "Could not update shapes: " + e.message;
    console.error(e);
  }
};
