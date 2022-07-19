import { TDToolType, TldrawApp } from "@tldraw/tldraw";
import React from "react";
import styled from "../../stitches.config";
import { AppContext } from "../Canvas";

export const ToolButton = ({
  toolType,
  children,
}: React.PropsWithChildren<{
  toolType: TDToolType;
  tldrawApp?: TldrawApp;
}>) => {
  const app = React.useContext(AppContext);

  const isActive = app.useStore((app) => {
    return app.appState.activeTool === toolType;
  });

  return (
    <PrimaryToolButton
      id={`select-tool-${toolType}`}
      isActive={isActive}
      onClick={() => app.selectTool(toolType)}
    >
      <Highlight>{children}</Highlight>
    </PrimaryToolButton>
  );
};

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
