import type { Action } from "~/src/state/constants";
import { mutables } from "~/src/state/mutables";

export const clearPointedBoundsHandle: Action = (data, payload) => {
  mutables.pointedBoundsHandleId = undefined;
};
