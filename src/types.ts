import { TDUser, TldrawProps } from "@tldraw/tldraw";

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

export type BoardMeta = {
  id: BoardId;
  createdBy: UserId;
  createdOn: Date;
};

export type FSUser = {
  id: UserId;
};

export interface FSAdapter {
  isLoading: boolean;
  createDocument: () => string;
  loadDocument: (input: Uint8Array) => void;
  serialiseDocument: () => Uint8Array;
  eventHandlers: TldrawProps;
  createDuplicate: (boardId: BoardId) => BoardId;
  board: BoardMeta;
  user: FSUser;
}
