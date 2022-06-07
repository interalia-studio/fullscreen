import type { TLPointerInfo } from "@tldraw/core";

import type { Action } from "~/src/state/constants";
import { getPagePoint } from "~/src/state/helpers";
import { mutables } from "~/src/state/mutables";

export const updatePointer: Action = (data, payload: TLPointerInfo) => {
  mutables.previousPoint = [...mutables.currentPoint];
  mutables.currentPoint = getPagePoint(payload.point, data.pageState);
};
