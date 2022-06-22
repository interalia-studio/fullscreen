import React from "react";

import { styled } from "~/src/theme";
import { machine } from "~/src/state/machine";

interface StatusBarProps {
    activeStates: string[];
    lastEvent: string;
}

const onReset = () => {
    machine.send("RESET");
  };

export const StatusBar = ({ activeStates, lastEvent }: StatusBarProps) => {
    return <StatusBarContainer>
        <StatusBarStyled>
    <div>
      <button onClick={onReset}>Reset</button>
      {activeStates
        .slice(1)
        .map((name) => {
          const state = name.split(".");
          return state[state.length - 1];
        })
        .join(" - ")}
    </div>
    <div>{lastEvent}</div>
  </StatusBarStyled>
</StatusBarContainer>
}

const StatusBarContainer = styled("div", {
    display: "grid",
    gridTemplateColumns: "1fr",
    gridTemplateRows: "auto auto",
    gridRowGap: "$5",
    position: "fixed",
    bottom: "0",
    width: "100%",
    zIndex: "101",
  });

const StatusBarStyled = styled("div", {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "8px 12px",
    borderTop: "1px solid $border",
    fontSize: "$1",
    fontWeight: "$1",
    backgroundColor: "$background",
    overflow: "hidden",
    whiteSpace: "nowrap",
  
    "& button": {
      background: "none",
      border: "1px solid $text",
      borderRadius: 3,
      marginRight: "$3",
      fontFamily: "inherit",
      fontSize: "inherit",
      cursor: "pointer",
    },
  });
  