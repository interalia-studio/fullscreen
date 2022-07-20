import { Tldraw, TldrawApp } from "@tldraw/tldraw";
import { appWindow } from "@tauri-apps/api/window";
import React, { useEffect, useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useYjsSession } from "../../adapters/yjs";
import fileSystem from "../../lib/fileSystem";
import { isNativeApp } from "../../lib/tauri";
import { Toolbar } from "../../components/Toolbar";
import { AppContext } from "../../components/Canvas";

export const Canvas = ({ boardId }: { boardId: string }) => {
  let navigate = useNavigate();

  const [tldrawApp, setTLDrawApp] = useState<TldrawApp>();
  const handleMount = useCallback(
    (tldraw: TldrawApp) => {
      tldraw.loadRoom(boardId);
      tldraw.pause();
      setTLDrawApp(tldraw);
    },
    [boardId]
  );

  const session = useYjsSession(tldrawApp, boardId);

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
    <div className="tldraw">
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
        showTools={false}
        {...session?.eventHandlers}
      />
      {tldrawApp && (
        <AppContext.Provider value={tldrawApp}>
          <Toolbar />
        </AppContext.Provider>
      )}
    </div>
  );
};
