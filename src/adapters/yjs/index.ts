import { TDBinding, TDShape, TDUser, TldrawApp } from "@tldraw/tldraw";
import { useCallback, useEffect, useState, useMemo } from "react";
import { v4 as uuid } from "uuid";
import { WebsocketProvider } from "y-websocket";
import * as Y from "yjs";

import { FileProvider } from "./fileProvider";
import Presence from "./presence";
import store from "./store";
import { BoardId, BoardMeta, FSAdapter, UserId } from "~/types";
import { getUserId } from "./identity";

/**
 * A `YjsSession` uses a Websocket connection to a relay server to sync document
 * changes and presence updates between collaborators.
 *
 * It can serialise and deserialise to a binary format.
 */
export const useYjsSession = (
  app: TldrawApp,
  passive: boolean,
  boardId: BoardId
): FSAdapter => {
  // This is false until the page state has been loaded from yjs
  const [isLoading, setLoading] = useState(true);

  // Fullscreen-scoped user id.
  const [userId, _] = useState<UserId>(getUserId());

  const [boardMeta, setBoardMeta] = useState<BoardMeta>(null);

  // @TODO: Connect file provider to file handle after saving from a browser that
  // implements the Filesystem Access API in order to auto-save.
  const localProvider = useMemo(() => new FileProvider(store.doc), [boardId]);

  const networkProvider = useMemo(
    () =>
      new WebsocketProvider(
        "wss://yjs.fullscreen.space",
        `yjs-fullscreen-${boardId}`,
        store.doc,
        {
          connect: true,
        }
      ),
    [boardId]
  );

  const room = useMemo(() => {
    // Don't initialise room if app is not ready.
    if (!app) return;
    return new Presence(networkProvider, app);
  }, [networkProvider, app]);

  /**
   * Replaces the full Tldraw document with shapes and bindings from y.js.
   */
  const replacePageWithDocState = () => {
    const shapes = Object.fromEntries(store.yShapes.entries());
    const bindings = Object.fromEntries(store.yBindings.entries());
    app.replacePageContent(shapes, bindings, {});
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
    [boardId]
  );

  /**
   * Connect Y.js doc to Tldraw widget and register teardown handlers
   */
  useEffect(() => {
    if (!app) return;

    room.connect(app);

    async function setup() {
      store.yShapes.observeDeep(replacePageWithDocState);
      store.board.observe(() => {
        setBoardMeta({
          id: store.board.get("id"),
          createdBy: store.board.get("createdBy"),
          createdOn: new Date(store.board.get("createdOn")),
        });
      });
      replacePageWithDocState();
      setLoading(false);
    }

    const tearDown = () => {
      store.yShapes.unobserveDeep(replacePageWithDocState);
      if (networkProvider) networkProvider.disconnect();
    };

    window.addEventListener("beforeunload", tearDown);
    setup();

    return () => {
      room.disconnect();
      window.removeEventListener("beforeunload", tearDown);
    };
  }, [boardId, app]);

  /**
   * Create a new board and return its id.
   */
  const createDocument = (): string => {
    // Create a new document instance.
    store.reset(null);

    // Set metadata.
    const newBoardId = uuid();
    // Prevent undoing initial set of the board id
    store.undoManager.stopCapturing();
    store.doc.transact(() => {
      store.board.set("id", newBoardId);
      store.board.set("createdBy", userId);
      store.board.set("createdOn", new Date().toUTCString());
    });

    return newBoardId;
  };

  /**
   * Load a binary representation of a document into the page and
   * reconnect the network provider.
   */
  const loadDocument = (serialisedDocument: Uint8Array): string => {
    setLoading(true);
    store.reset(serialisedDocument);
    if (networkProvider) networkProvider.disconnect();
    replacePageWithDocState();
    setLoading(false);

    // Validate that board has all metadata
    // TODO: Remove this once yjs.fullscreen.space doesn't contain documents without `boardId`.
    const boardId = store.board.get("id");
    const creator = store.board.get("createdBy");
    const createdOn = store.board.get("createdOn");
    if (boardId == null || creator == null || createdOn == null) {
      alert("Outdated document doesn't contain required metadata");
      return createDocument();
    }
    return boardId;
  };

  /**
   * Creeate and join a copy of the current board that can be edited independently.
   *
   * Disconnects the network provider and changes the board's `id`. When the network provider
   * reconnects it will send changes to a new room because the id has changed.
   *
   * @returns the newly created boardId
   */
  const createDuplicate = (): BoardId => {
    if (networkProvider) networkProvider.disconnect();
    store.undoManager.stopCapturing();
    const newBoardId = uuid();
    store.board.set("id", newBoardId);
    store.board.set("createdBy", userId);
    store.board.set("createdOn", new Date().toUTCString());
    return newBoardId;
  };

  /**
   * Returns a binary representation of the y.js document.
   */
  const serialiseDocument = (): Uint8Array => Y.encodeStateAsUpdate(store.doc);

  return {
    isLoading,
    createDocument,
    loadDocument,
    createDuplicate,
    serialiseDocument,
    board: {
      id: boardId,
      createdBy: boardMeta?.createdBy,
      createdOn: boardMeta?.createdOn,
    },
    user: {
      id: userId,
    },
    eventHandlers: {
      onChangePage: handleChangePage,

      onUndo: useCallback(() => {
        store.undo();
      }, [boardId]),

      onRedo: useCallback(() => {
        store.redo();
      }, [boardId]),

      onChangePresence: useCallback(
        (app: TldrawApp, user: TDUser) =>
          app && !passive && room && room.update(app.room.userId, user),
        [room]
      ),
    },
  };
};
