import type { Action } from "~/src/state/constants";

export const clearPerformanceMode: Action = (data) => {
  data.performanceMode = undefined;
};
