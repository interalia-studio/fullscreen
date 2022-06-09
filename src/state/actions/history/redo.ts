import store from "~/src/adapters/yjs/store";
import type { Action } from "~/src/state/constants";
import { mutables } from "../../mutables";

export const redo: Action = (data) => {
  store.redo();
};
