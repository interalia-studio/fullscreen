import type { Action } from "~/src/state/constants";

export const clearBrush: Action = (data) => {
  data.pageState.brush = undefined;
};
