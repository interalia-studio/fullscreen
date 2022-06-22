import type { FSShapeUtil } from "./FSShapeUtil";
import { ArrowShape, ArrowUtil } from "./arrow";
import { BoxShape, BoxUtil } from "./box";
import { PencilShape, PencilUtil } from "./pencil";
import { TLShapeUtilsMap } from "@tldraw/core";
import { StickyUtil, StickyShape } from "./sticky";

export * from "./arrow";
export * from "./pencil";
export * from "./box";

export type Shape = BoxShape | ArrowShape | PencilShape | StickyShape;

export const shapeUtils: TLShapeUtilsMap<Shape> = {
  box: new BoxUtil(),
  arrow: new ArrowUtil(),
  pencil: new PencilUtil(),
  sticky: new StickyUtil(),
};

export const getShapeUtils = <T extends Shape>(shape: T | T["type"]) => {
  if (typeof shape === "string")
    return shapeUtils[shape] as unknown as FSShapeUtil<T>;
  return shapeUtils[shape.type] as unknown as FSShapeUtil<T>;
};
