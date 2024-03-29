import { useContext } from "react";
import { useNavigate } from "react-router-dom";

import { Dialogue } from "../Dialogue";
import { Button } from "../Button";
import { StoreContext } from "../Store";

export const JoinBoard = () => {
  const store = useContext(StoreContext);
  const navigate = useNavigate();

  const handleMakeACopy = () => {
    const newBoardId = store.document.duplicate();
    navigate(newBoardId);
  };

  // Show the join dialogue once the session is loaded, if current user is not the board
  // author and has not already given consent to join.
  const showDialogue =
    !store.isLoading &&
    store.meta?.createdBy != null &&
    store.meta.createdBy !== store.user.id &&
    !store.collaborationConsent;

  const createdDateStr = store.meta?.createdOn.toLocaleDateString("en-us");

  return (
    showDialogue && (
      <Dialogue
        header={
          <>
            <h1>Untitled Document</h1>
            <h2>Created on {createdDateStr}</h2>
          </>
        }
        actions={
          <>
            <Button primary onClick={() => store.setCollaborationConsent(true)}>
              Join this board
            </Button>
            <Button onClick={handleMakeACopy}>Make a copy</Button>
          </>
        }
      >
        Do you want to join this collaborative board and sync your changes with
        anyone who has the link?
      </Dialogue>
    )
  );
};
