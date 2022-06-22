import store from "~/src/adapters/yjs/store";
import { Action } from "../../constants";
import { mutables } from "../../mutables";

export const publishUpdate: Action = (data, { shapes }) => {
  console.log(
    "Publishing updates",
    shapes.map((shape) => shape.id)
  );
  store.updateShapes(shapes);
};
