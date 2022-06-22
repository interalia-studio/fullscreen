import * as React from "react";
import {
  ArrowUpRight,
  Edit2,
  MousePointer,
  PenTool,
  Square,
  X,
} from "react-feather";

import { machine } from "~/src/state/machine";
import { styled } from "~/src/theme";

const onToolSelect = (e: React.MouseEvent) => {
  machine.send("SELECTED_TOOL", { name: e.currentTarget.id });
};

export const Toolbar = () => {
  return (
    <ToolbarContainer>
      <PrimaryTools>
        <PrimaryToolButton
          id="select"
          isActive={machine.isIn("select")}
          onClick={onToolSelect}
        >
          <Highlight>
            <MousePointer />
          </Highlight>
        </PrimaryToolButton>
        <PrimaryToolButton
          id="eraser"
          isActive={machine.isIn("eraser")}
          onClick={onToolSelect}
        >
          <Highlight>
            <X />
          </Highlight>
        </PrimaryToolButton>
        <PrimaryToolButton
          id="box"
          isActive={machine.isIn("box")}
          onClick={onToolSelect}
        >
          <Highlight>
            <Square />
          </Highlight>
        </PrimaryToolButton>
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

const Highlight = styled("div", {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "100%",
  height: "100%",
  padding: 10,
  borderRadius: "100%",
  transition: "background-color .025s",
});

const PrimaryToolButton = styled("button", {
  cursor: "pointer",
  width: "40px",
  height: "40px",
  padding: 2,
  margin: 0,
  background: "none",
  backgroundColor: "none",
  border: "none",
  color: "$text",

  variants: {
    isActive: {
      true: {
        color: "$background",
        [`& > ${Highlight}`]: {
          backgroundColor: "$text",
        },
      },
      false: {
        [`&:hover > ${Highlight}`]: {
          backgroundColor: "$hover",
        },
        "&:active": {
          color: "$background",
        },
        [`&:active > ${Highlight}`]: {
          backgroundColor: "$text",
        },
      },
    },
  },
});
