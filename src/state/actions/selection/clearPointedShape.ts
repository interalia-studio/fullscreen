import type { Action } from "~/src/state/constants";
import { mutables } from "~/src/state/mutables";

export const clearPointedShape: Action = () => {
  console.warn("Clear pointed shape", mutables.pointedShapeId);
  mutables.pointedShapeId = undefined;
};
