import { TDBinding, TDShape, TDUser, TldrawApp } from "@tldraw/tldraw";
import { useCallback, useEffect, useState, useMemo } from "react";
import { v4 as uuid } from "uuid";
import { WebsocketProvider } from "y-websocket";
import * as Y from "yjs";

import { FileProvider } from "./fileProvider";
import Presence from "./presence";
import store from "./store";
import { FSAdapter } from "~/types";

/**
 * A `YjsSession` uses a Websocket connection to a relay server to sync document
 * changes and presence updates between collaborators.
 *
 * It can serialise and deserialise to a binary format.
 */
export const useYjsSession = (app: TldrawApp, boardId: string): FSAdapter => {
  // This is false until the page state has been loaded from yjs
  const [isLoading, setLoading] = useState(true);

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
    store.reset(null);
    const newBoardId = uuid();
    // Prevent undoing initial set of the board id
    store.undoManager.stopCapturing();
    store.doc.transact(() => {
      store.board.set("id", newBoardId);
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
    const boardId = store.board.get("id");
    if (boardId == null) {
      alert("Outdated document doesn't contain a board id");
      return createDocument();
    }
    return boardId;
  };

  /**
   * Returns a binary representation of the y.js document.
   */
  const serialiseDocument = (): Uint8Array => Y.encodeStateAsUpdate(store.doc);

  return {
    isLoading,
    createDocument,
    loadDocument,
    serialiseDocument,
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
          app && room && room.update(app.room.userId, user),
        [room]
      ),
    },
  };
};
