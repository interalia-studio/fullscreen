import * as Y from "yjs";
import { TDBinding, TDShape } from "@tldraw/tldraw";

export class Doc {
  doc: Y.Doc;
  yShapes: Y.Map<TDShape>;
  yBindings: Y.Map<TDBinding>;
  undoManager: Y.UndoManager;

  constructor() {
    this.reset();
  }

  reset() {
    this.doc = new Y.Doc();
    this.yShapes = this.doc.getMap("shapes");
    this.yBindings = this.doc.getMap("bindings");
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
