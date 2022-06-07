import { current } from "immer";

import type { Action } from "~/src/state/constants";
import { mutables } from "~/src/state/mutables";

export const setSnapshot: Action = (data) => {
  mutables.snapshot = current(data);
};
