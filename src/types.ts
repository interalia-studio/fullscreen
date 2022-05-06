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

export interface FSAdapter {
  isLoading: boolean;
  createDocument: () => string;
  loadDocument: (input: Uint8Array) => void;
  serialiseDocument: () => Uint8Array;
  eventHandlers: TldrawProps;
}
