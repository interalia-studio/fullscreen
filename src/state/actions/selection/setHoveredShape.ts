import type { TLPointerInfo } from "@tldraw/core";
import type { Action } from "~/src/state/constants";

export const setHoveredShape: Action = (data, payload: TLPointerInfo) => {
  data.pageState.hoveredId = payload.target;
};
