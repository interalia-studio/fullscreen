import type { Action } from "~/src/state/constants";

export const clearSnapLines: Action = (data) => {
  data.overlays.snapLines = [];
};
