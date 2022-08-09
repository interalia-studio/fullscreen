import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { styled } from "~/styles";
import { StoreContext } from "../Store";

export const JoinBoard = () => {
  const store = useContext(StoreContext);
  const navigate = useNavigate();

  const handleMakeACopy = () => {
    const newBoardId = store.createDuplicate();
    navigate(newBoardId);
  };

  // Show the join dialogue once the session is loaded, if current user is not the board
  // author and has not already given consent to join.
  const displayJoinDialogue =
    !store.isLoading &&
    store.meta?.createdBy != null &&
    store.meta.createdBy !== store.user.id &&
    !store.collaborationConsent;

  return (
    displayJoinDialogue && (
      <ModalWrapper>
        <Dialogue>
          <DialogueHeader>
            <h1>Fullscreen Sprint 3</h1>
            <h2>Created by Rae on April 24, 2022</h2>
          </DialogueHeader>
          <DialogueBody>
            Do you want to join this collaborative board and sync your changes
            with anyone who has the link?
          </DialogueBody>
          <DialogueActions>
            <Button primary onClick={() => store.setCollaborationConsent(true)}>
              Join this board
            </Button>
            <Button onClick={handleMakeACopy}>Make a copy</Button>
          </DialogueActions>
        </Dialogue>
      </ModalWrapper>
    )
  );
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

const Dialogue = styled("section", {
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

const Button = styled("button", {
  display: "inline-block",
  padding: "5px 10px",
  backgroundColor: "white",
  borderRadius: "$2",
  borderWidth: "2px",
  cursor: "pointer",
  "& + &": {
    marginLeft: 10,
  },
  "&:hover": {
    backgroundColor: "$hover",
  },
  variants: {
    primary: {
      true: {
        backgroundColor: "$blue",
        color: "white",
        "&:hover": {
          backgroundColor: "$blueHover",
        },
      },
    },
  },
});
