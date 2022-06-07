import { TLPerformanceMode } from "@tldraw/core";
import type { Action } from "~/src/state/constants";

export const setTranslatePerformanceMode: Action = (data) => {
  data.performanceMode = undefined;
};
