import { useState } from "react";
import { v4 as uuid } from "uuid";
import { WebsocketProvider } from "y-websocket";
import { encodeStateAsUpdate } from "yjs";

import { BoardId, FSDocumentHandlers, FSUser } from "~/types";
import store from "./store";

export const useDocumentHandlers = (
  fsUser: FSUser,
  websocketProvider: WebsocketProvider,
  updateBoardContentsFromYjs: any
): FSDocumentHandlers => {
  const [isLoading, setLoading] = useState(false);

  /**
   * Create a new board and return its id.
   */
  const create = (): BoardId => {
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
   * Create and join a copy of the current board that can be edited independently.
   *
   * Disconnects the network provider and changes the board's `id`. When the network provider
   * reconnects it will send changes to a new Y.js room because the id has changed.
   *
   * @returns the newly created boardId
   */
  const duplicate = (): BoardId => {
    if (websocketProvider) websocketProvider.disconnect();
    store.undoManager.stopCapturing();
    const newBoardId = uuid();
    store.board.set("id", newBoardId);
    store.board.set("createdBy", fsUser.id);
    store.board.set("createdOn", new Date().toUTCString());
    return newBoardId;
  };

  /**
   * Load a binary representation of a document.
   */
  const load = (serialisedDocument: Uint8Array, filePath?: string): BoardId => {
    setLoading(true);
    store.reset(serialisedDocument);
    if (websocketProvider) websocketProvider.disconnect();
    updateBoardContentsFromYjs();
    setLoading(false);

    // Validate that board has all metadata
    // TODO: Remove this once yjs.fullscreen.space doesn't contain documents without `boardId`.
    const boardId = store.board.get("id");
    const creator = store.board.get("createdBy");
    const createdOn = store.board.get("createdOn");
    if (boardId == null || creator == null || createdOn == null) {
      alert("Outdated document doesn't contain required metadata");
      return create();
    }

    return boardId;
  };

  /**
   * Returns a binary representation of the y.js document.
   */
  const serialise = (): Uint8Array => encodeStateAsUpdate(store.doc);

  return {
    create,
    duplicate,
    load,
    serialise,
    isLoading,
  };
};
