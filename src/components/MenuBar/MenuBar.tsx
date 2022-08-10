import { styled } from "~/styles";
import { FileMenu } from "./FileMenu";
import { EditMenu } from "./EditMenu";
import { ViewMenu } from "./ViewMenu";
import { useCallback } from "react";

export const MenuBar = () => {
  return (
    <Wrapper>
      <FullscreenButton disabled>Fullscreen</FullscreenButton>
      <FileMenu />
      <EditMenu />
      <ViewMenu />
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
  fontSize: "$3",
  border: "none",
  backgroundColor: "$text",
  color: "$background",
  padding: "0 13px",
});
