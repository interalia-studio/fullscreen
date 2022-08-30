import { useMemo } from "react";
import { WebsocketProvider } from "y-websocket";
import { IndexeddbPersistence } from "y-indexeddb";
import debug from "debug";

import { BoardId } from "~/types";
import store from "./store";

export const useWebsocketProvider = (boardId: BoardId) => {
  return useMemo(() => {
    if (!boardId) return;

    return new WebsocketProvider(
      "wss://yjs.fullscreen.space",
      `yjs-fullscreen-${boardId}`,
      store.doc,
      {
        connect: true,
      }
    );
  }, [boardId]);
};

export const useIndexedDbProvider = (boardId: BoardId) => {
  return useMemo(() => {
    if (!boardId) return;

    const log = debug("fs:yjs:indexedDb");

    // In private browsing mode this may throw an error inside a promise
    // so `provider` may be null.
    const provider = new IndexeddbPersistence(
      `yjs-fullscreen-${boardId}`,
      store.doc
    );

    provider?.on("synced", () => {
      log("IndexedDB is synched");
    });
    return provider;
  }, [boardId]);
};
