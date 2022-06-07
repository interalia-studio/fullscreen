import type { Action } from "~/src/state/constants";
import { mutables } from "~/src/state/mutables";

export const restoreSnapshot: Action = (data) => {
  Object.assign(data, mutables.snapshot);
};
