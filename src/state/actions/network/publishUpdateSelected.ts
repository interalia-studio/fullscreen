import store from "~/src/adapters/yjs/store";
import { Action } from "../../constants";

export const publishUpdateSelected: Action = (data) => {
  const shapes = data.pageState.selectedIds.map((id) => data.page.shapes[id]);
  console.log("Publishing updates", shapes.length);
  store.updateShapes(shapes);
};
