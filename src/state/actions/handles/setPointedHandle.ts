import type { Action } from "~/src/state/constants";
import { mutables } from "~/src/state/mutables";

export const setPointedHandle: Action = (data, payload) => {
  mutables.pointedHandleId = payload.target;
};
