import type { CSS } from "@stitches/react";
import { normalize } from "stitches-normalize-css";

import { globalCss } from "./stitchesConfig";

import "./fonts.css";

const styles: Record<string, CSS> = {
  "*": {
    boxSizing: "border-box",
  },
  "html, body": {
    margin: 0,
    padding: 0,
    fontFamily: "$text",
  },
};

export const globalStyles = globalCss(...normalize, styles);
