import { TDUser } from "@tldraw/tldraw";

export interface TldrawPresence {
  id: string;
  tdUser: TDUser;
}

export interface FSBoard {
  id: string;
  shapes: string[];
  bindings: string[];
}
