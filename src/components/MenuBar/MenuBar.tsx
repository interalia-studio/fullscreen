import { useContext } from "react";

import { styled } from "~/styles";
import { StoreContext } from "../Store";
import { isNativeApp } from "~/lib/tauri";
import { FileMenu } from "./FileMenu";

export const MenuBar = () => {
  const store = useContext(StoreContext);
  return (
    <Wrapper>
      <FullscreenButton>Fullscreen</FullscreenButton>
      <FileMenu />
    </Wrapper>
  );
};

const Wrapper = styled("nav", {
  position: "absolute",
  top: 0,
  left: 0,
  width: "100vw",
  height: 30,
  zIndex: 200,
  display: "flex",
  flexDirection: "row",
  backgroundColor: "$text",
  color: "$background",
});

const FullscreenButton = styled("button", {
  fontFamily: "$text",
  border: "none",
  backgroundColor: "$text",
  color: "$background",
  cursor: "pointer",

  "&:hover": {
    borderColor: "$green",
    backgroundColor: "$green",
  },

  "&:focus": {
    borderColor: "$green",
    outline: "none",
  },
});
