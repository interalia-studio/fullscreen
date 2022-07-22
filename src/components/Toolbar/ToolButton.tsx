import { TDToolType, TldrawApp } from "@tldraw/tldraw";
import React from "react";

import { styled } from "~/styles";
import { AppContext } from "~/components/Canvas";

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
  // This makes webkit not glitch out the svg
  "& > svg": {
    width: "100%",
    height: "100%",
  },
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
        // Inverted colors when active
        color: "$background",
        [`& > ${Highlight}`]: {
          backgroundColor: "$text",
        },
      },
      false: {
        // Light shadow on hover
        [`&:hover > ${Highlight}`]: {
          backgroundColor: "$hover",
        },
        // Same style as in active state while pressed
        "&:active": {
          color: "$background",
          [`& > ${Highlight}`]: {
            backgroundColor: "$text",
          },
        },
      },
    },
  },
});
