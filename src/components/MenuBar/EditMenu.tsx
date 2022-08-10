import { useContext } from "react";

import { MenuButton, MenuContent, MenuItem, MenuRoot } from "./DropDown";

export const EditMenu = () => {
  return (
    <MenuRoot>
      <MenuButton>Edit</MenuButton>
      <MenuContent align="start">
        <MenuItem>Hello!</MenuItem>
      </MenuContent>
    </MenuRoot>
  );
};
