import * as Y from "yjs";
import { Observable } from "lib0/observable";
import { TldrawApp } from "@tldraw/tldraw";
import { v4 as uuid } from "uuid";
import store  from "./store";

import filePicker from "../../lib/filePicker";

/**
 * Connect to this provider to auto-save to a file
 */
export class FileProvider extends Observable<string> {
  /**
   * @param {Y.Doc} ydoc
   */
  constructor(ydoc) {
    super();

    ydoc.on("update", (update: Uint8Array, origin) => {
      // ignore updates applied by this provider
      if (origin !== this) {
        // this update was produced either locally or by another provider.
        this.emit("update", [update]);
      }
    });
    // listen to an event that fires when a remote update is received
    this.on("update", (update: Uint8Array) => {
      Y.applyUpdate(ydoc, update, this); // the third parameter sets the transaction-origin
    });
  }
}

export const useFileSystem = () => {
  const handlers = {
    onNewProject: () => {
      window.location.href = `/board/${uuid()}`;
    },
    onSaveProject: async (app: TldrawApp) => {
      let binary = Y.encodeStateAsUpdate(store.doc);
      filePicker.onSave(binary)
    },
    onSaveProjectAs: null,
    onOpenProject: async () => {
      let binary = await filePicker.onOpen()
      Y.applyUpdate(store.doc, binary)
    },
  };

  return handlers;
};
