import { TldrawApp } from "@tldraw/tldraw";
import React from "react";

/**
 * Provides access to the TLDraw instance.
 */
export const AppContext = React.createContext<TldrawApp>({} as any);
