import { Tldraw } from "@tldraw/tldraw";
import React from "react";
import { useParams } from "react-router-dom";
import { v4 as uuid } from "uuid";
import { TldrawApp } from "@tldraw/tldraw";
import { useCallback, useState } from "react";

import { useYjsSession } from "../adapters/yjs";
import fileSystem from "../lib/fileSystem";

const Board = () => {
  const { boardId } = useParams();

  const [app, setApp] = useState<TldrawApp>();
  const handleMount = useCallback(
    (app: TldrawApp) => {
      app.loadRoom(boardId);
      app.pause();
      setApp(app);
    },
    [boardId]
  );

  const session = useYjsSession(app, boardId, handleMount);

  const handleNewProject = () => {
    window.location.href = `/board/${uuid()}`;
  };

  const handleOpenProject = async () => {
    const fileContents = await fileSystem.openFile();
    session.loadDocument(fileContents);
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
