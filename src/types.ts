import { TLUser } from "@tldraw/core";
import { Shape } from "./shapes";

export interface TldrawPresence {
  id: string;
  tdUser: TLUser<Shape>;
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
  eventHandlers: any;
}
