import React from "react";
import { Renderer } from "@tldraw/core";

import { shapeUtils } from "~/src/shapes";
import { styled } from "~/src/theme";
import { Api } from "~/src/state/api";
import * as handlers from "./handlers";

import type { CanvasState } from "~/src/types";

declare const window: Window & { api: Api };

export type CanvasProps = {
  appState: CanvasState;
  hideBounds: boolean;
  hideResizeHandles: boolean;
};

export const Canvas = ({
  appState,
  hideBounds,
  hideResizeHandles,
}: CanvasProps) => {
  return (
    <CanvasContainer>
      <Renderer
        shapeUtils={shapeUtils} // Required
        page={appState.data.page} // Required
        pageState={appState.data.pageState} // Required
        performanceMode={appState.data.performanceMode}
        meta={appState.data.meta}
        // snapLines={appState.data.overlays.snapLines}
        snapLines={appState.data.snapLines}
        onPointShape={handlers.onPointShape}
        onPointBounds={handlers.onPointBounds}
        onPointCanvas={handlers.onPointCanvas}
        onPointerDown={handlers.onPointerDown}
        onPointerMove={handlers.onPointerMove}
        onHoverShape={handlers.onHoverShape}
        onUnhoverShape={handlers.onUnhoverShape}
        onPointBoundsHandle={handlers.onPointBoundsHandle}
        onPointHandle={handlers.onPointHandle}
        onPan={handlers.onPan}
        onPinchStart={handlers.onPinchStart}
        onPinchEnd={handlers.onPinchEnd}
        onPinch={handlers.onPinch}
        onPointerUp={handlers.onPointerUp}
        onBoundsChange={handlers.onBoundsChange}
        onKeyDown={handlers.onKeyDown}
        onKeyUp={handlers.onKeyUp}
        hideBounds={hideBounds}
        hideHandles={hideBounds}
        hideResizeHandles={hideResizeHandles}
        hideIndicators={hideBounds}
        hideBindingHandles={true}
      />
    </CanvasContainer>
  );
};

const CanvasContainer = styled("div", {
  position: "fixed",
  top: "0px",
  left: "0px",
  right: "0px",
  bottom: "0px",
  width: "100%",
  height: "100%",
  zIndex: 100,
});
