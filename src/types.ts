import { TDUser, TldrawProps } from "@tldraw/tldraw";
import { TDCallbacks, TldrawApp } from "@tldraw/tldraw/dist/state";
import { Room } from "@y-presence/client";

export interface TldrawPresence {
  id: string;
  tdUser: TDUser;
}

export interface FSBoard {
  id: string;
  shapes: string[];
  bindings: string[];
}

export type BoardId = string;
export type UserId = string;

export enum BoardStatus {
  Ok,
  NotFound,
}

export type BoardMeta = {
  /**
   * Fullscreen board id (store state).
   */
  id: BoardId;
  createdBy: UserId;
  createdOn: Date;
};

export type BoardContents = {
  shapes: any;
  bindings: any;
};

export type FSUser = {
  /**
   * UUID randomly generated per client. Should be persisted across sessions.
   */
  id: UserId;
};

export interface PresenceAdapter {
  connect: (app: TldrawApp) => void;
  disconnect: () => void;
  update: (id: string, tdUser: TDUser) => void;
}

export interface FSAdapter {
  isLoading: boolean;

  /**
   * When passive mode is set, no changes and presence is broadcast.
   */
  passiveMode: boolean;

  /**
   * See `FSAdapater.passiveMode`.
   */
  setPassiveMode: (enabled: boolean) => void;

  /**
   * Create a new board and return its id.
   */
  createDocument: () => BoardId;

  /**
   * Load a binary representation of a document and subscribe to changes.
   */
  loadDocument: (input: Uint8Array) => BoardId;

  /**
   * Serialise the current board state.
   */
  serialiseDocument: () => Uint8Array;

  /**
   * Create a duplicate of the current board that can evolve independently.
   */
  createDuplicate: () => BoardId;

  /**
   * Update presence information of the current user.
   */
  updatePresence: (tdUser: TDUser) => void;

  /**
   * Availability of the board.
   */
  status: BoardStatus;

  /**
   * Metadata about the current board as it exists in the network.
   */
  meta: BoardMeta;

  /**
   * Live updating board contents.
   */
  contents: BoardContents;

  /**
   * Current Fullscreen user.
   */
  user: FSUser;

  /**
   * Exchanges presence updates between TLDraw and adapter.
   */
  presence: PresenceAdapter;

  /**
   * Any handlers to be registered on the TLDraw component.
   */
  eventHandlers: TDCallbacks;
}

export interface Store extends FSAdapter {
  /**
   * Fullscreen board id (local state).
   */
  boardId: BoardId;
  handleNewProject: any;
  handleSaveProject: any;
  handleOpenProject: any;
  collaborationConsent: boolean;
  setCollaborationConsent: (consented: boolean) => void;
}
