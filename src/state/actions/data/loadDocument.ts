import { current } from "immer";
import type { Action, AppDocument } from "~/src/state/constants";
import { mutables } from "~/src/state/mutables";

export const loadDocument: Action = (data, payload: { doc: AppDocument }) => {
  Object.assign(data, payload.doc);

  const snapshot = current(data);

  // mutables.history.reset(snapshot);

  Object.assign(mutables, {
    snapshot,
    initialPoint: [0, 0],
    isCloning: false,
    pointedShapeId: undefined,
    pointedHandleId: undefined,
    pointedBoundsHandleId: undefined,
    initialCommonBounds: undefined,
    snapInfo: undefined,
  });
};
