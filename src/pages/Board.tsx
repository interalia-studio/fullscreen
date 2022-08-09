import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Store } from "~/components/Store/Store";

import { Canvas } from "~/components/Canvas";
import { Toolbar } from "~/components/Toolbar";
import { JoinBoard } from "~/components/JoinBoard";

export const Board = () => {
  const { boardId } = useParams();
  let navigate = useNavigate();

  return (
    <main>
      <Store boardId={boardId as string}>
        <Canvas>
          <Toolbar />
          <JoinBoard />
        </Canvas>
      </Store>
    </main>
  );
};
