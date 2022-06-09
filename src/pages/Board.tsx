import { appWindow } from "@tauri-apps/api/window";
import React, { useEffect, useCallback, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useStateDesigner } from "@state-designer/react";

import { useYjsSession } from "~/src/adapters/yjs";
import fileSystem from "~/src/lib/fileSystem";
import { isNativeApp } from "~/src/lib/tauri";
import store from "~/src/adapters/yjs/store";
import TLDrawWidget from "~/src/components/Canvas";
import Toolbar from "~/src/components/Toolbar";
import { machine } from "~/src/state/machine";
import { Api } from "~/src/state/api";
import { shapeUtils } from "~/src/shapes";

const Board = () => {
  const { boardId } = useParams();
  let navigate = useNavigate();

  const appState = useStateDesigner(machine);

  useEffect(() => {
    const api = new Api(appState);
    window["api"] = api;
  }, []);

  const hideBounds = appState.isInAny(
    "transformingSelection",
    "translating",
    "creating"
  );

  const firstShapeId = appState.data.pageState.selectedIds[0];
  const firstShape = firstShapeId
    ? appState.data.page.shapes[firstShapeId]
    : null;
  const hideResizeHandles = firstShape
    ? appState.data.pageState.selectedIds.length === 1 &&
      shapeUtils[firstShape.type].hideResizeHandles
    : false;

  // const [app, setApp] = useState<TldrawApp>();
  // const handleMount = useCallback(
  //   (app: TldrawApp) => {
  //     app.loadRoom(boardId);
  //     app.pause();
  //     setApp(app);
  //   },
  //   [boardId]
  // );

  const session = useYjsSession(appState, boardId);

  useEffect(() => {
    navigate(`/board/${appState.data.id}`);
  }, [appState.data.id]);

  const handleNewProject = () => {
    appState.send("RESET");
  };

  const handleOpenProject = async () => {
    const fileContents = await fileSystem.openFile();
    const newBoardId = api.loadDocument(fileContents);
    appState.send("LOADED_DOCUMENT", fileContents);

    navigate(`/board/${newBoardId}`);
  };

  const handleSaveProject = async () => {
    const fileContents = api.serialiseDocument();
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
      <Toolbar activeStates={appState.active} lastEvent={appState.log[0]} />
      <TLDrawWidget
        appState={appState}
        hideBounds={hideBounds}
        hideResizeHandles={hideResizeHandles}
      />
    </main>
  );
};

export default Board;
