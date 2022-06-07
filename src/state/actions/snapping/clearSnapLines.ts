import type { Action } from "~/src/state/constants";

export const clearSnaplines: Action = (data) => {
  data.overlays.snapLines = [];
};
