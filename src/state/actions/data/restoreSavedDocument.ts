import type { Action } from "~/src/state/constants";
import { mutables } from "../../mutables";

export const restoreSavedDocument: Action = (data) => {
  const snapshot = mutables.history.restore();
  Object.assign(data, snapshot);
};
