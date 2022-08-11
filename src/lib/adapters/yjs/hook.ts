import { TDBinding, TDShape, TDUser, TldrawApp } from "@tldraw/tldraw";
import { useCallback, useEffect, useState, useMemo, useContext } from "react";
import * as Y from "yjs";

import { FileProvider } from "./fileProvider";
import { usePresence } from "./presence";
import store from "./store";
import {
  BoardContents,
  BoardId,
  BoardMeta,
  FSAdapter,
  FSUser,
  BoardStatus,
} from "~/types";
import { getUserId } from "./identity";
import { useIndexedDbProvider, useWebsocketProvider } from "./providers";
import { isNativeApp } from "~/lib/tauri";
import { useDocumentHandlers } from "./document";

/**
 * A `useYjsAdapter` uses a Websocket connection to a relay server to sync document
 * changes and presence updates between collaborators.
 *
 * It can serialise and deserialise to a binary format.
 */
export const useYjsAdapter = (boardId: BoardId): FSAdapter => {
  // This is false until the page state has been loaded from yjs
  const [isLoading, setLoading] = useState(true);

  // Fullscreen-scoped user.
  const [fsUser, _] = useState<FSUser>({ id: getUserId() });

  // Availability of the board in the store.
  const [boardStatus, setBoardStatus] = useState(BoardStatus.NotFound);

  // Board data synced to y.js
  const [boardMeta, setBoardMeta] = useState<BoardMeta>();
  const [boardContents, setBoardContents] = useState({} as BoardContents);

  // When set, don't broadcast changes and presence.
  const [passiveMode, setPassiveMode] = useState(!isNativeApp());

  // @TODO: Connect file provider to file handle after saving from a browser that
  // implements the Filesystem Access API in order to auto-save.
  const localProvider = useMemo(() => new FileProvider(store.doc), [boardId]);

  const websocketProvider = useWebsocketProvider(boardId);
  useIndexedDbProvider(boardId);

  const presence = usePresence(websocketProvider, passiveMode, fsUser);

  const updateBoardContentsFromYjs = () => {
    const shapes = Object.fromEntries(store.yShapes.entries());
    const bindings = Object.fromEntries(store.yBindings.entries());
    setBoardContents({
      shapes,
      bindings,
    });
  };

  /**
   * Update board metadata state from y.js
   */
  const updateBoardMeta = () => {
    const id = store.board.get("id");

    // As we can't distinguish a non-existing board from a board with no changes
    // we use the board id meta attribute as a proxy. If a board is loaded that does
    // not exist in the WebsocketProvider, the y.js board id will not be available.
    // Here, the board status is set to ok only if the board id that is expected locally
    // matches what can be loaded from the store.
    if (id === boardId) {
      setBoardStatus(BoardStatus.Ok);
    }

    setBoardMeta((prev) => ({
      ...prev,
      id,
      createdBy: store.board.get("createdBy"),
      createdOn: new Date(store.board.get("createdOn")),
    }));
  };

  /**
   * Handle changes made through the TLDraw widget.
   */
  const handleChangePage = useCallback(
    (
      _app: TldrawApp,
      shapes: Record<string, TDShape | undefined>,
      bindings: Record<string, TDBinding | undefined>
    ) => {
      store.undoManager.stopCapturing();
      store.doc.transact(() => {
        Object.entries(shapes).forEach(([id, shape]) => {
          if (!shape) {
            store.yShapes.delete(id);
          } else {
            store.yShapes.set(shape.id, shape);
          }
        });
        Object.entries(bindings).forEach(([id, binding]) => {
          if (!binding) {
            store.yBindings.delete(id);
          } else {
            store.yBindings.set(binding.id, binding);
          }
        });
      });
    },
    [boardId, store.undoManager, store.doc, store.yShapes, store.yBindings]
  );

  /**
   * Connect Y.js doc to Tldraw widget and register teardown handlers
   */
  useEffect(() => {
    if (!boardId) return;

    async function setup() {
      store.board.observe(updateBoardMeta);
      store.yShapes.observeDeep(updateBoardContentsFromYjs);
      updateBoardMeta();
      updateBoardContentsFromYjs();
      setLoading(false);
    }

    const tearDown = () => {
      store.board.unobserve(updateBoardMeta);
      store.yShapes.unobserveDeep(updateBoardContentsFromYjs);
      if (websocketProvider) websocketProvider.disconnect();
    };

    window.addEventListener("beforeunload", tearDown);
    setup();

    return () => {
      presence.disconnect();
      window.removeEventListener("beforeunload", tearDown);
    };
  }, [boardId]);

  const documentHandlers = useDocumentHandlers(
    fsUser,
    websocketProvider,
    updateBoardContentsFromYjs
  );

  return {
    isLoading,
    passiveMode,
    setPassiveMode,

    document: documentHandlers,

    user: fsUser,
    presence,

    contents: boardContents,
    meta: boardMeta,
    status: boardStatus,

    eventHandlers: {
      onChangePage: handleChangePage,

      onUndo: useCallback(() => {
        store.undo();
      }, [boardMeta?.id]),

      onRedo: useCallback(() => {
        store.redo();
      }, [boardMeta?.id]),
    },
  };
};
