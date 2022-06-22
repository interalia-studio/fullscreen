import store from "~/src/adapters/yjs/store";
import type { Action } from "~/src/state/constants";

export const deleteShapes: Action = (data, payload: { ids: string[] }) => {
  try {
    data.pageState.selectedIds = data.pageState.selectedIds.filter(
      (id) => !payload.ids.includes(id)
    );

    payload.ids.forEach((id) => {
      delete data.page.shapes[id];
    });
    store.deleteShapes(payload.ids);
  } catch (e: any) {
    e.message = "Could not delete shapes: " + e.message;
    console.error(e);
  }
};
