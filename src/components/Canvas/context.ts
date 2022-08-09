import { TldrawApp } from "@tldraw/tldraw";
import React from "react";

/**
 * Provides access to the TLDraw instance.
 */
export const TldrawContext = React.createContext<TldrawApp>({} as any);
