import * as Y from "yjs";
import { Observable } from "lib0/observable";

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
