import * as Y from "yjs";
import { TDBinding, TDShape } from "@tldraw/tldraw";

export class Doc {
  // A Y.js doc that contains all board contents and metadata.
  doc: Y.Doc;

  // Reference to metadata about the board.
  board: Y.Map<string>;

  // Reference to Tldraw shapes.
  yShapes: Y.Map<TDShape>;

  // Reference to bindings between Tldraw shapes.
  yBindings: Y.Map<TDBinding>;

  // Manages undo and redo state/actions.
  undoManager: Y.UndoManager;

  constructor() {
    this.reset(null);
  }

  reset(initialUpdate: Uint8Array) {
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
}

const store = new Doc();

export default store;
