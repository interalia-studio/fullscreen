import { TDUser, Tldraw, TldrawApp } from "@tldraw/tldraw";
import React, { useEffect, useCallback, useState, useContext } from "react";
import debug from "debug";

import { isNativeApp } from "~/lib/tauri";
import { AppContext } from "~/components/Canvas";
import { StoreContext } from "../Store";

const log = debug("fs:canvas");

/**
 * Mounts a TLDraw canvas and provides a `TldrawContext`
 */
export const Canvas: React.FC<{
  children: React.ReactNode;
}> = (props) => {
  let store = useContext(StoreContext);

  const [tldrawApp, setTLDrawApp] = useState<TldrawApp>();

  const handleMount = useCallback(
    (tldraw: TldrawApp) => {
      tldraw.loadRoom(store.boardId);
      tldraw.pause();
      setTLDrawApp(tldraw);
      (window as unknown as any).app = tldraw;
    },
    [store.boardId]
  );

  useEffect(() => {
    if (tldrawApp && store.presence) {
      store.presence.connect(tldrawApp);
    }
  }, [tldrawApp, store.presence]);

  useEffect(() => {
    if (tldrawApp && store.contents.shapes && store.contents.bindings) {
      tldrawApp.replacePageContent(
        store.contents.shapes,
        store.contents.bindings,
        {}
      );
    }
  }, [tldrawApp, store.contents, store.boardId]);

  const handlePresenceChange = useCallback(
    (_app: TldrawApp, user: TDUser) => {
      store.updatePresence(user);
    },
    [store]
  );

  return (
    <div className="tldraw">
      <Tldraw
        disableAssets
        showPages={false}
        showMultiplayerMenu={false}
        readOnly={false}
        onMount={handleMount}
        onNewProject={store.handleNewProject}
        onOpenProject={store.handleOpenProject}
        onSaveProject={store.handleSaveProject}
        showMenu={!isNativeApp()}
        // Disable TLDraw's own toolbar.
        showTools={false}
        onChangePresence={handlePresenceChange}
        {...store?.eventHandlers}
      />
      {tldrawApp && (
        <AppContext.Provider value={tldrawApp}>
          {props.children}
        </AppContext.Provider>
      )}
    </div>
  );
};
