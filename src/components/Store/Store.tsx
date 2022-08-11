import React, { useCallback, useEffect, useMemo, useState } from "react";
import { appWindow } from "@tauri-apps/api/window";
import { useNavigate } from "react-router-dom";

import { useYjsAdapter } from "~/lib/adapters/yjs";
import { BoardId } from "~/types";
import { isNativeApp } from "~/lib/tauri";
import fileSystem from "~/lib/fileSystem";
import { StoreContext } from ".";

/**
 * Initialises a network adapter and provides a `StoreContext`.
 *
 * Navigates to a new document if `boardId` is not set.
 */
export const Store: React.FC<{
  boardId: BoardId | null;
  children: React.ReactNode;
}> = (props) => {
  const navigate = useNavigate();
  const adapter = useYjsAdapter(props.boardId);

  // True when user has given consent to broadcast their changes and presence.
  const [collaborationConsent, setCollaborationConsent] = useState<boolean>(
    isNativeApp()
  );

  useEffect(() => {
    if (!isNativeApp()) {
      const isCreator = adapter.meta?.createdBy === adapter.user.id;
      adapter.setPassiveMode(!collaborationConsent && !isCreator);
    }
  }, [collaborationConsent]);

  /**
   * Setup Tauri event handlers on mount
   */
  useEffect(() => {
    if (isNativeApp()) {
      appWindow.listen("tauri://menu", ({ payload }) => {
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

  const handleNewProject = useCallback(() => {
    const newBoardId = adapter.createDocument();
    navigate(`/board/${newBoardId}`);
  }, [adapter, navigate]);

  const handleOpenProject = useCallback(async () => {
    const fileContents = await fileSystem.openFile();
    const newBoardId = adapter.loadDocument(fileContents);
    navigate(`/board/${newBoardId}`);
  }, [adapter]);

  const handleSaveProject = useCallback(async () => {
    const fileContents = adapter.serialiseDocument();
    await fileSystem.saveFile(fileContents);
  }, [adapter]);

  // Store context extends the adapter with functionality that is independent
  // of the network used.
  const context = useMemo(
    () =>
      Object.assign({}, adapter, {
        boardId: props.boardId,
        handleNewProject,
        handleOpenProject,
        handleSaveProject,
        collaborationConsent,
        setCollaborationConsent,
      }),
    [props.boardId, adapter]
  );

  useEffect(() => {
    if (props.boardId == null) handleNewProject();
  }, [props.boardId]);

  return (
    !adapter.isLoading && (
      <StoreContext.Provider value={context}>
        {props.children}
      </StoreContext.Provider>
    )
  );
};
