import { useContext } from "react";

import { isNativeApp } from "~/lib/tauri";
import { StoreContext } from "~/components/Store";
import { MenuButton, MenuContent, MenuItem, MenuRoot } from "./DropDown";

export const EditMenu = () => {
  const store = useContext(StoreContext);

  return (
    <MenuRoot>
      <MenuButton>Edit</MenuButton>
      <MenuContent align="start">
        <MenuItem>Hello!</MenuItem>
      </MenuContent>
    </MenuRoot>
  );
};
