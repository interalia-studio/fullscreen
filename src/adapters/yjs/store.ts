import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { TDBinding, TDShape } from "@tldraw/tldraw";

// Create the doc
export class Doc {
  doc: Y.Doc;
  yShapes: Y.Map<TDShape>
  yBindings: Y.Map<TDBinding>

  constructor() {
    this.reset()
  }
  // Create an undo manager for the shapes and binding maps
  undoManager = (ctx: Set<any> | null) =>
    new Y.UndoManager([this.yShapes, this.yBindings], { trackedOrigins: ctx });

  reset() {
    this.doc = new Y.Doc()
    this.yShapes = this.doc.getMap("shapes");
    this.yBindings = this.doc.getMap("bindings");
  }
}

const store = new Doc();

export default store;
