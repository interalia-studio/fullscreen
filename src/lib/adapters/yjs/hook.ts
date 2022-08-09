import { TDBinding, TDShape, TDUser, TldrawApp } from "@tldraw/tldraw";
import { useCallback, useEffect, useState, useMemo, useContext } from "react";
import { v4 as uuid } from "uuid";
import { WebsocketProvider } from "y-websocket";
import * as Y from "yjs";
import debug from "debug";

import { FileProvider } from "./fileProvider";
import YPresence from "./presence";
import store from "./store";
import {
  BoardContents,
  BoardId,
  BoardMeta,
  FSAdapter,
  FSUser,
  UserId,
} from "~/types";
import { getUserId } from "./identity";
import { AppContext } from "~/components/Canvas";

const log = debug("fs:yjs");

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

  // Board metadata synced to y.js
  const [boardMeta, setBoardMeta] = useState<BoardMeta>(null);

  const [boardContents, setBoardContents] = useState({} as BoardContents);

  // When set, don't broadcast changes and presence.
  const [passiveMode, setPassiveMode] = useState(true);

  // @TODO: Connect file provider to file handle after saving from a browser that
  // implements the Filesystem Access API in order to auto-save.
  const localProvider = useMemo(() => new FileProvider(store.doc), [boardId]);

  const networkProvider = useMemo(() => {
    return new WebsocketProvider(
      "wss://yjs.fullscreen.space",
      `yjs-fullscreen-${boardId}`,
      store.doc,
      {
        connect: true,
      }
    );
  }, [boardId]);

  const presence = useMemo(() => {
    if (!networkProvider) return;
    return new YPresence(networkProvider);
  }, [networkProvider]);

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
    setBoardMeta({
      id: store.board.get("id"),
      createdBy: store.board.get("createdBy"),
      createdOn: new Date(store.board.get("createdOn")),
    });
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
    async function setup() {
      store.board.observe(updateBoardMeta);
      store.yShapes.observeDeep(updateBoardContentsFromYjs);
      updateBoardMeta;
      updateBoardContentsFromYjs();
      setLoading(false);
    }

    const tearDown = () => {
      store.yShapes.unobserveDeep(updateBoardContentsFromYjs);
      if (networkProvider) networkProvider.disconnect();
    };

    window.addEventListener("beforeunload", tearDown);
    setup();

    return () => {
      presence.disconnect();
      window.removeEventListener("beforeunload", tearDown);
    };
  }, [boardId]);

  /**
   * Create a new board and return its id.
   */
  const createDocument = (): BoardId => {
    // Create a new document instance.
    store.reset(null);

    // Set metadata.
    const newBoardId = uuid();
    // Prevent undoing initial set of the board id
    store.undoManager.stopCapturing();
    store.doc.transact(() => {
      store.board.set("id", newBoardId);
      store.board.set("createdBy", fsUser.id);
      store.board.set("createdOn", new Date().toUTCString());
    });

    return newBoardId;
  };

  /**
   * Load a binary representation of a document.
   */
  const loadDocument = (serialisedDocument: Uint8Array): BoardId => {
    setLoading(true);
    store.reset(serialisedDocument);
    if (networkProvider) networkProvider.disconnect();
    updateBoardContentsFromYjs();
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
   * Create and join a copy of the current board that can be edited independently.
   *
   * Disconnects the network provider and changes the board's `id`. When the network provider
   * reconnects it will send changes to a new Y.js room because the id has changed.
   *
   * @returns the newly created boardId
   */
  const createDuplicate = (): BoardId => {
    if (networkProvider) networkProvider.disconnect();
    store.undoManager.stopCapturing();
    const newBoardId = uuid();
    store.board.set("id", newBoardId);
    store.board.set("createdBy", fsUser.id);
    store.board.set("createdOn", new Date().toUTCString());
    return newBoardId;
  };

  /**
   * Returns a binary representation of the y.js document.
   */
  const serialiseDocument = (): Uint8Array => Y.encodeStateAsUpdate(store.doc);

  /**
   * Broadcasts presence information unless store is in passive mode.
   */
  const updatePresence = useCallback(
    (userPresence: TDUser) => {
      if (!passiveMode && presence) presence.update(fsUser.id, userPresence);
    },
    [passiveMode, presence, fsUser]
  );

  return {
    isLoading,
    passiveMode,
    setPassiveMode,

    createDocument,
    loadDocument,
    createDuplicate,
    serialiseDocument,

    user: fsUser,
    presence: presence,
    updatePresence,

    contents: boardContents,
    meta: {
      id: boardMeta?.id,
      createdBy: boardMeta?.createdBy,
      createdOn: boardMeta?.createdOn,
    },

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
