import type { Action } from "~/src/state/constants";
import { mutables } from "~/src/state/mutables";

export const clearPointedHandle: Action = () => {
  mutables.pointedHandleId = undefined;
};
