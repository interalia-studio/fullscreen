import { TLPerformanceMode } from "@tldraw/core";
import type { Action } from "~/src/state/constants";

export const setTransformPerformanceMode: Action = (data) => {
  data.performanceMode = undefined;
};
