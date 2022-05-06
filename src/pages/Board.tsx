import { Tldraw } from "@tldraw/tldraw";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { TldrawApp } from "@tldraw/tldraw";
import { useCallback, useState } from "react";

import { useYjsSession } from "../adapters/yjs";
import fileSystem from "../lib/fileSystem";
import store from "../adapters/yjs/store";

const Board = () => {
  const { boardId } = useParams();
  let navigate = useNavigate();

  const [app, setApp] = useState<TldrawApp>();
  const handleMount = useCallback(
    (app: TldrawApp) => {
      app.loadRoom(boardId);
      app.pause();
      setApp(app);
    },
    [boardId]
  );

  const session = useYjsSession(app, boardId);

  // console.log(store.board.get("id"));

  const handleNewProject = (app1: TldrawApp) => {
    const newBoardId = session.createDocument();
    navigate(`/board/${newBoardId}`);
  };

  const handleOpenProject = async () => {
    const fileContents = await fileSystem.openFile();
    const newBoardId = session.loadDocument(fileContents);
    navigate(`/board/${newBoardId}`);
  };

  const handleSaveProject = async () => {
    const fileContents = session.serialiseDocument();
    await fileSystem.saveFile(fileContents);
  };

  return (
    <main>
      <Tldraw
        disableAssets
        showPages={false}
        showMultiplayerMenu={false}
        readOnly={session?.isLoading}
        onMount={handleMount}
        onNewProject={handleNewProject}
        onOpenProject={handleOpenProject}
        onSaveProject={handleSaveProject}
        {...session?.eventHandlers}
      />
    </main>
  );
};

export default Board;
