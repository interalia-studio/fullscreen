import { TDBinding, TDShape, TDUser, TldrawApp } from "@tldraw/tldraw";
import { Room } from "@y-presence/client";
import { WebsocketProvider } from "y-websocket";
import { UndoManager } from "yjs";
import { FSBoard, TldrawPresence } from "../../types";
import { FileProvider } from "./fileProvider";
import { undoManager, doc, yShapes, yBindings } from "./store";

export default class Session {
  // Websocket provider for exchanging yjs patches
  networkProvider: WebsocketProvider;
  localProvider: FileProvider;
  undoManager: UndoManager;

  // y-presence room syncs all users' presence state
  room: Room;

  // Identifies a shared board
  sessionId: string;

  _changeHandler: any;
  _handleDisconnect: Function;

  constructor(sessionId: string, userId: string) {
    this.sessionId = sessionId;
    this.undoManager = undoManager(new Set(userId));
    this.networkProvider = new WebsocketProvider(
      "wss://yjs.fullscreen.space",
      `yjs-fullscreen-${sessionId}`,
      doc,
      {
        connect: true,
      }
    );
    this.localProvider = new FileProvider(doc);
    this.room = new Room(this.networkProvider.awareness);
  }

  getShapes() {
    return Object.fromEntries(yShapes.entries());
  }

  getBindings() {
    return Object.fromEntries(yBindings.entries());
  }

  handleEditorChanges(
    app: TldrawApp,
    shapes: Record<string, TDShape | undefined>,
    bindings: Record<string, TDBinding | undefined>
  ) {
    this.undoManager.stopCapturing();
    doc.transact(() => {
      Object.entries(shapes).forEach(([id, shape]) => {
        if (!shape) {
          yShapes.delete(id);
        } else {
          yShapes.set(shape.id, shape);
        }
      });
      Object.entries(bindings).forEach(([id, binding]) => {
        if (!binding) {
          yBindings.delete(id);
        } else {
          yBindings.set(binding.id, binding);
        }
      });
    });
  }

  onChanges(handler) {
    this._changeHandler = handler;
    yShapes.observeDeep(handler);
  }

  onUndo() {
    this.undoManager.undo();
  }

  onRedo() {
    this.undoManager.redo();
  }

  connectPresence(handlePresenceChanges) {
    if (!this.room) return console.log("Unable to connect presence");

    this._handleDisconnect = this.room.subscribe<TldrawPresence>(
      "others",
      handlePresenceChanges
    );
  }

  disconnectPresence() {
    if (this._handleDisconnect) {
      this._handleDisconnect();
    }
  }

  updatePresence = (id: string, tdUser: TDUser) => {
    if (!this.room) return;
    this.room.setPresence<TldrawPresence>({ id, tdUser });
  };

  close() {
    if (this._changeHandler) {
      yShapes.unobserveDeep(this._changeHandler);
    }
    if (this.networkProvider) {
      this.networkProvider.disconnect();
    }
  }
}
