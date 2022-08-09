import { Tldraw, TldrawApp } from "@tldraw/tldraw";
import { appWindow } from "@tauri-apps/api/window";
import React, { useEffect, useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useYjsSession } from "~/lib/adapters/yjs";
import fileSystem from "~/lib/fileSystem";
import { isNativeApp } from "~/lib/tauri";
import { Toolbar } from "~/components/Toolbar";
import { AppContext } from "~/components/Canvas";
import { JoinBoard } from "../JoinBoard";

export const Canvas = ({ boardId }: { boardId: string }) => {
  let navigate = useNavigate();

  const [tldrawApp, setTLDrawApp] = useState<TldrawApp>();

  // True when user has given consent to broadcast their changes and presence.
  const [collaborationConsent, setCollaborationConsent] = useState<boolean>(
    isNativeApp()
  );

  const handleMount = useCallback(
    (tldraw: TldrawApp) => {
      tldraw.loadRoom(boardId);
      tldraw.pause();
      setTLDrawApp(tldraw);
    },
    [boardId]
  );

  const session = useYjsSession(tldrawApp, !collaborationConsent, boardId);

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

  const openDuplicate = async () => {
    const newBoardId = session.createDuplicate(boardId);
    navigate(`/board/${newBoardId}`);
  };

  // Show the join dialogue once the session is loaded, if current user is not the board
  // author and has not already given consent to join.
  const displayJoinDialogue =
    !session.isLoading &&
    session.board?.createdBy != null &&
    session.board.createdBy !== session.user.id &&
    !collaborationConsent;

  return (
    <div className="tldraw">
      <Tldraw
        disableAssets
        showPages={false}
        showMultiplayerMenu={false}
        readOnly={session?.isLoading || !collaborationConsent}
        onMount={handleMount}
        onNewProject={handleNewProject}
        onOpenProject={handleOpenProject}
        onSaveProject={handleSaveProject}
        showMenu={!isNativeApp()}
        // Disable TLDraw's own toolbar.
        showTools={false}
        {...session?.eventHandlers}
      />
      {tldrawApp && (
        <AppContext.Provider value={tldrawApp}>
          <Toolbar />

          {displayJoinDialogue && (
            <JoinBoard
              onJoin={() => setCollaborationConsent(true)}
              onCopyBoard={openDuplicate}
            />
          )}
        </AppContext.Provider>
      )}
    </div>
  );
};
