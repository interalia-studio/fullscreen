import { TLShape } from "@tldraw/core";
import { nanoid } from "nanoid";
import store from "~/src/adapters/yjs/store";
import { getShapeUtils, Shape, shapeUtils } from "~/src/shapes";
import { Action } from "../../constants";

export const publishSelectedShape: Action = (data): void => {
  const shape = data.page.shapes[data.pageState.selectedIds[0]];
  console.log("Publishing shape", shape);
  store.createShape(shape);
};
