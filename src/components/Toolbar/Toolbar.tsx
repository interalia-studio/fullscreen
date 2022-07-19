import { TDShapeType, TDToolType, TldrawApp } from "@tldraw/tldraw";
import React from "react";
import { MousePointer, Square, X } from "react-feather";

import styled from "../../stitches.config";

const AppContext = React.createContext<TldrawApp>({} as any);

function useApp() {
  return React.useContext(AppContext);
}

function ToolButton({
  toolType,
  children,
}: React.PropsWithChildren<{
  toolType: TDToolType;
  tldrawApp?: TldrawApp;
}>) {
  const app = useApp();

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
}

export const Toolbar = ({ tldraw }: { tldraw: TldrawApp }) => {
  return (
    <AppContext.Provider value={tldraw}>
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
    </AppContext.Provider>
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
