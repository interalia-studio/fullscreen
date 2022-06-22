import store from "~/src/adapters/yjs/store";
import { Action } from "../../constants";
import { publishDelete } from "./publishDelete";

export const publishDeleteSelected: Action = (data) => {
  publishDelete(data, { ids: data.pageState.selectedIds });
};
