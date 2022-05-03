import * as Y from "yjs";
import { Observable } from "lib0/observable";
import { TldrawApp } from "@tldraw/tldraw";
import { v4 as uuid } from "uuid";

import { doc } from "./store";

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

export const useFileSystem = () => ({
  onNewProject: () => {
    window.location.href = `/board/${uuid()}`;
  },
  onSaveProjectAs: async (app: TldrawApp) => {
    // uses the new files and directories api which is not available in ff
    const newHandle = await (window as any).showSaveFilePicker();
    const writableStream = await newHandle.createWritable();
    await writableStream.write(Y.encodeStateAsUpdate(doc));
    await writableStream.close();
  },

  onOpenProject: async () => {
    const [fileHandle] = await (window as any).showOpenFilePicker({
      types: [
        {
          description: "Fullscreen Boards",
          accept: {
            "application/fullscreen": [".fullscreen"],
          },
        },
      ],
      multiple: false,
    });

    const bufferLike = await fileHandle.getFile();
    const fileReader = new FileReader();
    fileReader.onload = (event) => {
      const update = new Uint8Array(event.target.result as ArrayBuffer);
      Y.applyUpdate(doc, update);
    };
    fileReader.readAsArrayBuffer(bufferLike);
  },
});
