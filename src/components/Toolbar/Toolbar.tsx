import { TDShapeType, TDToolType, TldrawApp } from "@tldraw/tldraw";
import React from "react";
import { MousePointer, Square, X } from "react-feather";

import styled from "../../stitches.config";
import { ToolButton } from "./ToolButton";

export const Toolbar = () => {
  return (
    <ToolbarContainer>
      <PrimaryTools>
        <ToolButton toolType="select">
          <MousePointer />
        </ToolButton>
        <ToolButton toolType={TDShapeType.Sticky}>
          <Square />
        </ToolButton>
        <ToolButton toolType="erase">
          <X />
        </ToolButton>
      </PrimaryTools>
    </ToolbarContainer>
  );
};

const ToolbarContainer = styled("div", {
  display: "grid",
  gridTemplateColumns: "1fr",
  gridTemplateRows: "auto auto",
  gridRowGap: "$5",
  position: "fixed",
  bottom: "0",
  width: "100%",
  zIndex: "100",
});

const PrimaryTools = styled("div", {
  display: "flex",
  width: "fit-content",
  borderRadius: "100px",
  border: "1px solid $border",
  overflow: "hidden",
  padding: "$2",
  justifySelf: "center",
  backgroundColor: "$background",
});
