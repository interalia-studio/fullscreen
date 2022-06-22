import store from "~/src/adapters/yjs/store";
import { Action } from "../../constants";

export const publishDelete: Action = (data, { ids }) => {
  store.deleteShapes(ids);
};
