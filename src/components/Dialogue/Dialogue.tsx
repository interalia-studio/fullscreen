import React from "react";
import { styled } from "~/styles";

export const Dialogue: React.FC<{
  children: React.ReactNode;
  header: React.ReactNode;
  actions: React.ReactNode;
}> = (props) => {
  return (
    <ModalWrapper>
      <InnerDialogue>
        {props.header && <DialogueHeader>{props.header}</DialogueHeader>}
        <DialogueBody>{props.children}</DialogueBody>
        {props.actions && <DialogueActions>{props.actions}</DialogueActions>}
      </InnerDialogue>
    </ModalWrapper>
  );
};

Dialogue.defaultProps = {
  header: null,
  actions: null,
};

const ModalWrapper = styled("div", {
  position: "absolute",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  backgroundColor: "rgba(255, 255, 255, 0.7)",
  zIndex: 200,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

const InnerDialogue = styled("section", {
  maxWidth: 500,
  backdropFilter: "blur(20px)",
  padding: "1em",
  borderRadius: "3px",
  borderTop: "1px solid white",
});

const DialogueHeader = styled("div", {
  "&> h1": {
    fontSize: 24,
  },
  "&> h2": {
    fontSize: 18,
  },
});

const DialogueBody = styled("div");

const DialogueActions = styled("div", {
  marginTop: "2em",
});
