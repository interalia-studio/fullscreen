import type { TLPointerInfo } from "@tldraw/core";

import type { Action } from "~/src/state/constants";
import { getPagePoint } from "~/src/state/helpers";
import { mutables } from "~/src/state/mutables";

export const setInitialPoint: Action = (data, payload: TLPointerInfo) => {
  mutables.initialPoint = getPagePoint(payload.origin, data.pageState);
  mutables.previousPoint = [...mutables.initialPoint];
};
