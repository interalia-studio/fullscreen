import { Tldraw, TldrawApp } from "@tldraw/tldraw";
import { appWindow } from "@tauri-apps/api/window";
import React, { useEffect, useCallback, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { v4 as uuid } from "uuid";

import { useYjsSession } from "../adapters/yjs";
import fileSystem from "../lib/fileSystem";
import { isNativeApp } from "../lib/tauri";
import store from "../adapters/yjs/store";

import "./board.css";

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

  const handleNewProject = () => {
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

  /**
   * Setup Tauri event handlers on mount
   */
  useEffect(() => {
    if (isNativeApp()) {
      appWindow.listen("tauri://menu", ({ windowLabel, payload }) => {
        switch (payload) {
          case "open":
            handleOpenProject();
            break;
          case "save":
            handleSaveProject();
        }
      });
    }
  }, []);

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
        showMenu={!isNativeApp()}
        {...session?.eventHandlers}
      />
    </main>
  );
};

export default Board;
