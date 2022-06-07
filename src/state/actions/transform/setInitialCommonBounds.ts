import { Utils } from "@tldraw/core";
import { getShapeUtils } from "~/src/shapes";
import type { Action } from "~/src/state/constants";
import { mutables } from "~/src/state/mutables";

export const setInitialCommonBounds: Action = (data) => {
  const { snapshot } = mutables;
  const { selectedIds } = data.pageState;

  const initialCommonBounds = Utils.getCommonBounds(
    selectedIds
      .map((id) => snapshot.page.shapes[id])
      .map((shape) => getShapeUtils(shape).getBounds(shape))
  );

  mutables.initialCommonBounds = initialCommonBounds;
};
