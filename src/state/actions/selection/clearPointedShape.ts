import type { Action } from "~/src/state/constants";
import { mutables } from "~/src/state/mutables";

export const clearPointedShape: Action = () => {
  mutables.pointedShapeId = undefined;
};
