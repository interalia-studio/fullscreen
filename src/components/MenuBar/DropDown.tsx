import * as Dropdown from "@radix-ui/react-dropdown-menu";

import { styled } from "~/styles";

export const MenuRoot = Dropdown.Root;

export const MenuButton = styled(Dropdown.Trigger, {
  fontFamily: "$text",
  border: "none",
  backgroundColor: "$text",
  color: "$background",
  cursor: "pointer",
  padding: "0 13px",

  "&:hover": {
    borderColor: "$green",
    backgroundColor: "$green",
  },

  "&:focus": {
    border: "none",
    outline: "none",
  },
});

export const MenuContent = styled(Dropdown.Content, {
  backgroundColor: "$text",
  minWidth: 220,
  padding: 3,
});

export const MenuItem = styled(Dropdown.Item, {
  all: "unset",
  fontSize: 13,
  lineHeight: 1,
  color: "$background",
  borderRadius: 3,
  display: "flex",
  alignItems: "center",
  height: 25,
  padding: "0 5px 0 10px",
  position: "relative",
  userSelect: "none",

  "&[data-highlighted]": {
    backgroundColor: "$blue",
    color: "$background",
  },
});
