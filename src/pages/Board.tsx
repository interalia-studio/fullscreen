import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Store } from "~/components/Store/Store";

import { Canvas } from "~/components/Canvas";
import { Toolbar } from "~/components/Toolbar";
import { JoinBoard } from "~/components/JoinBoard";
import { BoardStatusDialogue } from "~/components/BoardStatusDialogue";

export const Board = () => {
  const { boardId } = useParams();
  let navigate = useNavigate();

  if (boardId == null || boardId.length == 0) navigate("/");

  return (
    <main>
      <Store boardId={boardId as string}>
        <Canvas>
          <Toolbar />
          <JoinBoard />
          <BoardStatusDialogue />
        </Canvas>
      </Store>
    </main>
  );
};
