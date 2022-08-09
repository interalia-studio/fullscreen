import { useContext, useEffect, useState } from "react";

import { Button } from "../Button";
import { StoreContext } from "../Store";
import { BoardStatus } from "~/types";
import { Dialogue } from "../Dialogue";

export const BoardStatusDialogue = () => {
  const store = useContext(StoreContext);
  const [visible, setVisible] = useState(false);

  const shouldDisplay = visible && store.status === BoardStatus.NotFound;

  useEffect(() => {
    setTimeout(() => setVisible(true), 1000);
  }, []);

  return (
    shouldDisplay && (
      <Dialogue
        header={<h1>Board not found</h1>}
        actions={
          <>
            <Button primary onClick={() => store.handleNewProject()}>
              Create a new board
            </Button>
            <Button onClick={() => store.handleOpenProject()}>
              Open an existing board
            </Button>
          </>
        }
      >
        Check if your link is correct and still valid.
      </Dialogue>
    )
  );
};
