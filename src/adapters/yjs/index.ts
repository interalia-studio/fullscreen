import { TDBinding, TDShape, TDUser, TldrawApp } from "@tldraw/tldraw";
import { useCallback, useEffect, useState, useMemo } from "react";
import { WebsocketProvider } from "y-websocket";
import * as Y from "yjs";

import { FileProvider } from "./fileProvider";
import Presence from "./presence";
import store from "./store";
import { FSAdapter } from "../../types";

/**
 * A `YjsSession` uses a Websocket connection to a relay server to sync document
 * changes and presence updates between collaborators.
 *
 * It can serialise and deserialise to a binary format.
 */
export const useYjsSession = (
  app: TldrawApp,
  boardId: string,
  onChangePresence: (user: TDUser) => any
): FSAdapter => {
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

  const room = useMemo(() => new Presence(networkProvider), [networkProvider]);

  /**
   * Handle changes made through the TLDraw widget.
   */
  const onChangePage = useCallback(
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

    const replacePageWithDocState = () => {
      const shapes = Object.fromEntries(store.yShapes.entries());
      const bindings = Object.fromEntries(store.yBindings.entries());
      app.replacePageContent(shapes, bindings, {});
    };

    const tearDown = () => {
      store.yShapes.unobserveDeep(replacePageWithDocState);
      if (networkProvider) networkProvider.disconnect();
    };

    window.addEventListener("beforeunload", tearDown);

    async function setup() {
      store.yShapes.observeDeep(replacePageWithDocState);
      replacePageWithDocState();
      setLoading(false);
    }
    setup();

    return () => {
      room.disconnect();
      window.removeEventListener("beforeunload", tearDown);
    };
  }, [boardId, app]);

  const loadDocument = (binary: Uint8Array) => {
    // @TODO: Store document id in yjs, when loading from file redirect
    // to the document's actual URL
    // store.reset();
    Y.applyUpdate(store.doc, binary);
  };

  const serialiseDocument = (): Uint8Array => Y.encodeStateAsUpdate(store.doc);

  return {
    isLoading,
    loadDocument,
    serialiseDocument,
    eventHandlers: {
      onChangePage,

      onUndo: useCallback(() => {
        store.undo();
      }, [boardId]),

      onRedo: useCallback(() => {
        store.redo();
      }, [boardId]),

      onChangePresence: useCallback(
        (app: TldrawApp, user: TDUser) => {
          app && room.update(app.room.userId, user);
          onChangePresence(user);
        },
        [room]
      ),
    },
  };
};
