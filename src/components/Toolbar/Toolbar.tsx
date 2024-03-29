import { TDShapeType } from "@tldraw/tldraw";
import React from "react";
import {
  ArrowUpRight,
  MousePointer,
  Square,
  Type,
  X,
  Edit2,
} from "react-feather";

import { styled } from "~/styles";
import { ToolButton } from "./ToolButton";

import StickyNote from "../../assets/icons/sticky.svg";

export const Toolbar = () => {
  return (
    <ToolbarContainer>
      <PrimaryTools>
        <ToolButton toolType="select">
          <MousePointer />
        </ToolButton>
        <ToolButton toolType={TDShapeType.Sticky}>
          <StickyNote />
        </ToolButton>
        <ToolButton toolType={TDShapeType.Arrow}>
          <ArrowUpRight />
        </ToolButton>
        <ToolButton toolType={TDShapeType.Rectangle}>
          <Square />
        </ToolButton>
        <ToolButton toolType={TDShapeType.Text}>
          <Type />
        </ToolButton>
        <ToolButton toolType={TDShapeType.Draw}>
          <Edit2 />
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
  left: "5px",
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
  backgroundColor: "white",
});
