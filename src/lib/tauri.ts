import { useEffect } from "react";
import { appWindow } from "@tauri-apps/api/window";

/**
 * Returns true if Fullscreen is running as a native app.
 */
export const isNativeApp = () => {
  return (window as any).__TAURI__ != null;
};
