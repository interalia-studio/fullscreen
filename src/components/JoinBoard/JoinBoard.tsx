import { styled } from "~/styles";

type JoinBoardProps = {
  onJoin: () => any;
  onCopyBoard: () => any;
  isCopyingBoard: boolean;
};

export const JoinBoard = ({
  onJoin,
  onCopyBoard,
  isCopyingBoard,
}: JoinBoardProps) => {
  return (
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
          <Button primary onClick={onJoin} disabled={isCopyingBoard}>
            Join this board
          </Button>
          <Button onClick={onCopyBoard} disabled={true}>
            Make a copy
          </Button>
        </DialogueActions>
      </Dialogue>
    </ModalWrapper>
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
  borderRadius: 3,
  cursor: "pointer",
  "& + &": {
    marginLeft: 10,
  },
  "&:hover": {
    backdropFilter: "brightness(85%)",
  },
  variants: {
    primary: {
      true: {
        backgroundColor: "$blue",
        color: "white",
      },
    },
  },
});
