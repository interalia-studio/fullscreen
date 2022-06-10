import { TLBinding, TLShape, TLUser } from "@tldraw/core";
import { useCallback, useEffect, useState, useMemo } from "react";
import { v4 as uuid } from "uuid";
import { WebsocketProvider } from "y-websocket";
import * as Y from "yjs";

import { FileProvider } from "./fileProvider";
import Presence from "./presence";
import store from "./store";
import { FSAdapter } from "../../types";
import { Shape } from "~/src/shapes";
import { Api } from "~/src/state/api";
import { machine } from "~/src/state/machine";

/**
 * A `YjsSession` uses a Websocket connection to a relay server to sync document
 * changes and presence updates between collaborators.
 *
 * It can serialise and deserialise to a binary format.
 */
export const useYjsSession = (
  app: typeof machine,
  boardId: string
): FSAdapter => {
  // This is false until the page state has been loaded from yjs
  const [isLoading, setLoading] = useState(true);

  // @TODO: Connect file provider to file handle after saving from a browser that
  // implements the Filesystem Access API in order to auto-save.
  // const localProvider = useMemo(() => new FileProvider(store.doc), [boardId]);

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

  // const room = useMemo(() => new Presence(networkProvider), [networkProvider]);

  /**
   * Replaces the full Tldraw document with shapes and bindings from y.js.
   */
  const replacePageWithDocState = () => {
    let create = [],
      update = [],
      removeSet = new Set(Object.keys(app.data.page.shapes));

    for (const shape of [...store.yShapes.values()]) {
      // Only delete shapes that are not in the y.js doc anymore
      removeSet.delete(shape.id);
      if (Object.keys(app.data.page.shapes).includes(shape.id)) {
        update.push(shape);
      } else {
        create.push(shape);
      }
    }
    console.table([
      ...[...create].map((shape) => ({
        op: "created",
        id: shape.id,
        type: shape.type,
      })),
      ...[...update].map((shape) => ({
        op: "updated",
        id: shape.id,
        type: shape.type,
      })),
      ...[...removeSet].map((shapeId) => ({
        op: "deleted",
        id: shapeId,
      })),
    ]);
    app.send("CREATED_SHAPES", { shapes: create });
    app.send("UPDATED_SHAPES", { shapes: update });
    app.send("DELETED_SHAPES", { ids: [...removeSet] });
    // app.send("UPDATED_BINDINGS", store.yBindings.values());
  };

  /**
   * Connect Y.js doc to Tldraw widget and register teardown handlers
   */
  useEffect(() => {
    if (!app) return;

    // room.connect(app);

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
      // room.disconnect();
      window.removeEventListener("beforeunload", tearDown);
    };
  }, [boardId]);

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

  const handleCreateShape = (id: string, data: TLShape) => {
    store.undoManager.stopCapturing();
    store.yShapes.set(id, data);
  };

  const handleUpdateShape = (id: string, data: TLShape) => {
    store.undoManager.stopCapturing();
    store.yShapes.set(id, data);
  };

  const handleDeleteShape = (id: string) => {
    store.undoManager.stopCapturing();
    store.yShapes.delete(id);
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
      handleCreateShape,
      handleUpdateShape,
      handleDeleteShape,

      // onChangePage: handleChangePage,

      // onUndo: useCallback(() => {
      //   store.undo();
      // }, [boardId]),

      // onRedo: useCallback(() => {
      //   store.redo();
      // }, [boardId]),

      // onChangePresence: useCallback(
      //   (app: TldrawApp, user: TLUser) =>
      //     app && room.update(app.room.userId, user),
      //   [room]
      // ),
    },
  };
};
