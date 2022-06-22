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
  left: "0",
  height: "100%",
  zIndex: "101",
});

const PrimaryTools = styled("div", {
  display: "flex",
  height: "fit-content",
  margin: "auto",
  flexDirection: "column",
  borderRadius: "100px",
  border: "1px solid $border",
  overflow: "hidden",
  padding: "$2",
  justifySelf: "center",
  backgroundColor: "$background",
});
