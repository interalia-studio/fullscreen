import { RendererProps, TLSnapLine, TLUser } from "@tldraw/core";
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
  eventHandlers: {
    handleCreateShape: (id: string, data) => void;
    handleUpdateShape: (id: string, data) => void;
    handleDeleteShape: (id: string) => void;
  };
}

export type CanvasMetadata = {
  isDarkMode: boolean;
};

export interface CanvasState {
  data: RendererProps<Shape, CanvasMetadata>;
}
