import { TldrawApp } from "@tldraw/tldraw";
import React from "react";

export const AppContext = React.createContext<TldrawApp>({} as any);
