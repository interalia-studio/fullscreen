import { useParams } from "react-router-dom";
import { Store } from "~/components/Store/Store";

import { Canvas } from "~/components/Canvas";
import { Toolbar } from "~/components/Toolbar";
import { JoinBoard } from "~/components/JoinBoard";
import { BoardStatusDialogue } from "~/components/BoardStatusDialogue";
import { MenuBar } from "~/components/MenuBar";
import { BoardId } from "~/types";
import { isNativeApp } from "~/lib/tauri";

export const Board = () => {
  const { boardId } = useParams();
  return (
    <main>
      <Store boardId={boardId as BoardId}>
        <Canvas>
          {!isNativeApp() && <MenuBar />}
          <Toolbar />
          {/* Components with conditional visibility: */}
          <JoinBoard />
          <BoardStatusDialogue />
        </Canvas>
      </Store>
    </main>
  );
};
