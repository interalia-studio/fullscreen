import type { Action } from "~/src/state/constants";
import { mutables } from "~/src/state/mutables";

export const setPointedBoundsHandle: Action = (data, payload) => {
  mutables.pointedBoundsHandleId = payload.target;
};
