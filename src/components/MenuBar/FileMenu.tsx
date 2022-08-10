import { useContext } from "react";

import { isNativeApp } from "~/lib/tauri";
import { StoreContext } from "~/components/Store";
import { MenuButton, MenuContent, MenuItem, MenuRoot } from "./DropDown";

export const FileMenu = () => {
  const store = useContext(StoreContext);

  return (
    <MenuRoot>
      <MenuButton>File</MenuButton>
      <MenuContent align="start">
        <MenuItem onClick={() => store.handleNewProject()}>New</MenuItem>
        <MenuItem onClick={() => store.handleOpenProject()}>Open</MenuItem>
        {isNativeApp() && (
          <MenuItem onClick={() => store.handleSaveProject()}>
            Save as...
          </MenuItem>
        )}
        {!isNativeApp() && (
          <MenuItem onClick={() => store.handleSaveProject()}>
            Save a copy
          </MenuItem>
        )}
      </MenuContent>
    </MenuRoot>
  );
};
