import { globalCss } from "@stitches/react";
import { normalize } from "stitches-normalize-css";

export const globalStyles = globalCss(...normalize, {
  "*": {
    boxSizing: "border-box",
  },
  "html, body": {
    margin: 0,
    padding: 0,
  },
});
