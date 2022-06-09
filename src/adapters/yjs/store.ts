import * as Y from "yjs";
import { TLBinding, TLShape } from "@tldraw/core";
import { nanoid } from "nanoid";

export class Doc {
  // A Y.js doc that contains all board contents and metadata.
  doc: Y.Doc;

  // Reference to metadata about the board.
  board: Y.Map<string>;

  // Reference to Tldraw shapes.
  yShapes: Y.Map<TLShape>;

  // Reference to bindings between Tldraw shapes.
  yBindings: Y.Map<TLBinding>;

  // Manages undo and redo state/actions.
  undoManager: Y.UndoManager;

  constructor() {
    this.reset(null);
  }

  /**
   * Reset the document store with an optional initial update to apply.
   *
   * @param initialUpdate serialised yjs update
   */
  reset(initialUpdate: Uint8Array | null) {
    this.doc = new Y.Doc();
    if (initialUpdate) Y.applyUpdate(this.doc, initialUpdate);
    this.yShapes = this.doc.getMap("shapes");
    this.yBindings = this.doc.getMap("bindings");
    this.board = this.doc.getMap("board");
    this.undoManager = new Y.UndoManager([this.yShapes, this.yBindings]);
  }

  undo() {
    this.undoManager.undo();
  }

  redo() {
    this.undoManager.redo();
  }

  createShape(value: TLShape): string {
    const id = nanoid();
    this.doc.transact(() => {
      this.yShapes.set(id, value);
      console.log("Created shape", id);
    });
    return id;
  }
}

const store = new Doc();

export default store;
