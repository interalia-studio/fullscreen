import { TLShape } from "@tldraw/core";
import { nanoid } from "nanoid";
import store from "~/src/adapters/yjs/store";
import { getShapeUtils, Shape, shapeUtils } from "~/src/shapes";

export const publishShape = (data, payload: TLShape): string => {
  console.log("Creating shape", payload);
  return store.createShape(payload);
};
