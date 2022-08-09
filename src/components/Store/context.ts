import React from "react";
import { Store } from "~/types";

/**
 * Provides access to store.
 */
export const StoreContext = React.createContext<Store>({} as Store);
