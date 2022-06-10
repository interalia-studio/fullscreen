import * as Y from "yjs";
import { TLBinding, TLShape } from "@tldraw/core";
import { nanoid } from "nanoid";
import { shapeUtils } from "~/src/shapes";

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

  /**
   * Insert a single shape into the doc.
   */
  createShape(value: TLShape) {
    this.doc.transact(() => {
      this.yShapes.set(value.id, value);
      console.log("Created shape", value.id);
    });
  }

  /**
   * Update an array of shapes identified by their ID.
   */
  updateShapes(shapes: (Partial<TLShape> & Pick<TLShape, "id">)[]) {
    this.doc.transact(() => {
      shapes.forEach((shape) => {
        const prevState = this.yShapes.get(shape.id);
        this.yShapes.set(shape.id, Object.assign(prevState, shape));
      });
      console.log("Updated shapes", shapes);
    });
  }

  /**
   * Delete shapes based on ID.
   */
  deleteShapes(ids: string[]) {
    this.doc.transact(() => {
      ids.forEach((id) => this.yShapes.delete(id));
      if (ids.length > 0) console.log("Deleted shapes", [...ids]);
    });
  }
}

const store = new Doc();

export default store;
