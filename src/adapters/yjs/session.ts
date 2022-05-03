import { TDBinding, TDShape, TDUser, TldrawApp } from "@tldraw/tldraw";
import { Room } from "@y-presence/client";
import { WebsocketProvider } from "y-websocket";
import { UndoManager } from "yjs";
import { FSBoard, TldrawPresence } from "../../types";
import { FileProvider } from "./fileProvider";
import store from "./store";

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
    this.undoManager = store.undoManager(new Set(userId));
    this.networkProvider = new WebsocketProvider(
      "wss://yjs.fullscreen.space",
      `yjs-fullscreen-${sessionId}`,
      store.doc,
      {
        connect: true,
      }
    );
    this.localProvider = new FileProvider(store.doc);
    this.room = new Room(this.networkProvider.awareness);
  }

  getShapes() {
    return Object.fromEntries(store.yShapes.entries());
  }

  getBindings() {
    return Object.fromEntries(store.yBindings.entries());
  }

  handleEditorChanges(
    app: TldrawApp,
    shapes: Record<string, TDShape | undefined>,
    bindings: Record<string, TDBinding | undefined>
  ) {
    this.undoManager.stopCapturing();
    store.doc.transact(() => {
      Object.entries(shapes).forEach(([id, shape]) => {
        if (!shape) {
          store.yShapes.delete(id);
        } else {
          store.yShapes.set(shape.id, shape);
        }
      });
      Object.entries(bindings).forEach(([id, binding]) => {
        if (!binding) {
          store.yBindings.delete(id);
        } else {
          store.yBindings.set(binding.id, binding);
        }
      });
    });
  }

  onChanges(handler) {
    this._changeHandler = handler;
    store.yShapes.observeDeep(handler);
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
      store.yShapes.unobserveDeep(this._changeHandler);
    }
    if (this.networkProvider) {
      this.networkProvider.disconnect();
    }
  }
}
