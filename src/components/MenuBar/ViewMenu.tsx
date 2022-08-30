import { useContext } from "react";
import { Check } from "react-feather";

import { TldrawContext } from "~/components/Canvas/context";
import { styled } from "~/styles";
import {
  CheckboxItem,
  MenuButton,
  MenuContent,
  MenuIndicator,
  MenuRoot,
} from "./DropDown";

export const ViewMenu = () => {
  const tldraw = useContext(TldrawContext);
  const tldrawSettings = tldraw.useStore((s) => s.settings);

  return (
    <MenuRoot>
      <MenuButton>View</MenuButton>
      <MenuContent align="start">
        <CheckboxItem
          checked={tldrawSettings.showGrid}
          onClick={() => tldraw.setSetting("showGrid", (v) => !v)}
        >
          Show grid
          <MenuIndicator>
            <SmallIcon>
              <Check color="white" />
            </SmallIcon>
          </MenuIndicator>
        </CheckboxItem>
      </MenuContent>
    </MenuRoot>
  );
};

const SmallIcon = styled("div", {
  height: "100%",
  borderRadius: "4px",
  marginRight: "1px",
  width: "fit-content",
  display: "grid",
  alignItems: "center",
  justifyContent: "center",
  outline: "none",
  border: "none",
  pointerEvents: "all",
  color: "currentColor",

  "& svg": {
    height: 16,
    width: 16,
    strokeWidth: 2,
  },

  "& > *": {
    gridRow: 1,
    gridColumn: 1,
  },
});
